'use client';

import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for router
import {updateOrderStatusToReadyAPI} from '@/lib/api/deliveryService'; // Adjust the import path as necessary

interface MapComponentProps {
  start?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
}

const defaultCenter = {
  lat: 6.9271, // Colombo, Sri Lanka
  lng: 79.8612,
};

// --- PolylineOnMap Component (can be in its own file) ---
interface PolylineOnMapProps {
  path: { lat: number; lng: number }[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
}

function PolylineOnMap({
  path,
  strokeColor = '#4285F4', // Default Google Blue
  strokeWeight = 4,
  strokeOpacity = 1.0,
}: PolylineOnMapProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length < 2) return;
    if (!window.google || !window.google.maps || !window.google.maps.Polyline) {
      console.warn("Google Maps API not fully loaded for Polyline.");
      return;
    }
    const polyline = new window.google.maps.Polyline({
      path,
      geodesic: false,
      strokeColor,
      strokeOpacity,
      strokeWeight,
    });
    polyline.setMap(map);
    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor, strokeWeight, strokeOpacity]);

  return null;
}

// --- Placeholder PopupCard Component ---
// TODO: Replace this with your actual PopupCard component implementation
function PopupCard({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 1000 }}>
      <h2>Order Confirmation</h2>
      <p>The trip has ended. Did you deliver the order ?</p>
      <button onClick={onClose} style={{ marginTop: '15px', padding: '8px 15px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
        Yes
      </button>
    </div>
  );
}


// --- RealTimeDirections Component (Modified) ---
interface RealTimeDirectionsProps {
  startLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
}

function RealTimeDirections({ startLocation, destinationLocation }: RealTimeDirectionsProps) {
  const router = useRouter(); //  Get router instance
  const map = useMap();
  const [routePath, setRoutePath] = useState<{ lat: number; lng: number }[]>([]);
  const [driverPosition, setDriverPosition] = useState<{ lat: number; lng: number } | null>(startLocation || null);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulationRunToEnd, setHasSimulationRunToEnd] = useState(false); // New state
  const [showPopupCard, setShowPopupCard] = useState(false); // New state

  // Effect to fetch directions
  useEffect(() => {
    setRoutePath([]);
    setDriverPosition(startLocation || null);
    setCurrentPathIndex(0);
    setIsSimulating(false);
    setHasSimulationRunToEnd(false); // Reset on new route
    setShowPopupCard(false);      // Reset on new route

    if (!map || !startLocation || !destinationLocation) return;

    if (!window.google || !window.google.maps || !window.google.maps.DirectionsService) {
      console.warn('DirectionsService not available yet.');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(startLocation.lat, startLocation.lng),
        destination: new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result && result.routes && result.routes.length > 0) {
          const path = result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
          setRoutePath(path);
          setDriverPosition(path[0] || startLocation);
          setCurrentPathIndex(0);
          if (result.routes[0].bounds) {
            map.fitBounds(result.routes[0].bounds);
          }
        } else {
          console.error(`Directions request failed due to ${status}`);
          setRoutePath([]);
        }
      }
    );
  }, [map, startLocation, destinationLocation]);

  // Effect to animate the driver
  useEffect(() => {
    if (!isSimulating || routePath.length === 0 || hasSimulationRunToEnd) {
      // Do not run timer if not simulating, no path, or simulation has already run to end.
      return;
    }

    // If currentPathIndex is already at the end when isSimulating becomes true (e.g. resuming at the end)
    // this check ensures it correctly marks as completed.
    if (currentPathIndex >= routePath.length - 1) {
        setIsSimulating(false);
        setHasSimulationRunToEnd(true);
        console.log("Simulation already at destination.");
        return;
    }

    const simulationSpeed = 20; // Adjusted speed
    const timer = setInterval(() => {
      setCurrentPathIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < routePath.length -1) { // Move until one before last point
          setDriverPosition(routePath[nextIndex]);
          if (map && map.getBounds() && !map.getBounds()!.contains(new window.google.maps.LatLng(routePath[nextIndex].lat, routePath[nextIndex].lng))) {
             map.panTo(routePath[nextIndex]);
          }
          return nextIndex;
        } else if (nextIndex === routePath.length -1 ) { // Reached the last point of the path
          setDriverPosition(routePath[nextIndex]); // Move to the very last point
          clearInterval(timer);
          setIsSimulating(false);
          setHasSimulationRunToEnd(true); // Mark simulation as completed
          console.log("Destination Reached! Simulation complete.");
          return nextIndex; // Return the last index
        }
        // Fallback to clear interval if something unexpected happens
        clearInterval(timer);
        setIsSimulating(false);
        return prevIndex;
      });
    }, simulationSpeed);

    return () => clearInterval(timer);
  }, [isSimulating, routePath, currentPathIndex, map, hasSimulationRunToEnd]);

  const handlePopupCloseAndRedirect = async() => {
    setShowPopupCard(false);
    const updateResult = await updateOrderStatusToReadyAPI();
    if (updateResult.success) {
      console.log("Order status successfully updated. Redirecting to driver home.");
    }
    else{
      console.error("Failed to update order status.");
    }
    router.push('/driver/home'); // Redirect to the home page
  };

  const handleToggleSimulation = () => {
    if (hasSimulationRunToEnd) {
      setShowPopupCard(true); // If simulation has completed, show popup
      return;
    }
    

    if (isSimulating) {
      setIsSimulating(false); // Pause simulation
    } else {
      // Start or resume simulation
      if (routePath.length > 0) {
        // Ensure driver is at the correct start/resume point if not already simulating
        if (currentPathIndex === 0 && (!driverPosition || (driverPosition.lat !== routePath[0].lat || driverPosition.lng !== routePath[0].lng))) {
          setDriverPosition(routePath[0]);
        } else if (currentPathIndex > 0 && routePath[currentPathIndex] && (!driverPosition || (driverPosition.lat !== routePath[currentPathIndex].lat || driverPosition.lng !== routePath[currentPathIndex].lng))) {
          setDriverPosition(routePath[currentPathIndex]); // Sync position if resuming from a paused state
        }
        setIsSimulating(true);
      }
    }
  };
  
  const isAtDestination = currentPathIndex >= routePath.length - 1 && routePath.length > 0;
  let buttonText;
  let buttonDisabled = false;

  if (hasSimulationRunToEnd) {
    buttonText = 'Complete Order'; // Final action label
  } else if (isSimulating) {
    buttonText = 'Pause Delivery';
  } else { // Not simulating, and not yet run to end
    if (isAtDestination) {
      // This state means it was paused exactly at the destination before hasSimulationRunToEnd was set.
      // Clicking will trigger the simulation, which should then immediately set hasSimulationRunToEnd.
      buttonText = 'Deliver Order'; // As per user's label logic
    } else if (currentPathIndex > 0 && routePath.length > 0) { // Paused mid-trip
      buttonText = 'Resume Trip';
    } else { // At the start or no route yet
      buttonText = 'Start Trip';
    }
  }

  if (routePath.length === 0 && !hasSimulationRunToEnd && (startLocation && destinationLocation)) {
    buttonText = 'Calculating Route...';
    buttonDisabled = true; // Disable button while calculating if no path yet
  } else if (routePath.length === 0 && !hasSimulationRunToEnd){
    buttonText = 'Set Start/Destination'; // Or similar prompt
    buttonDisabled = true;
  }


  const buttonStyle: React.CSSProperties = {
    fontSize: '1rem',
    padding: '8px 16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: '#007bff', // Default blue for Start/Resume/PickUp Order (after completion)
  };

  if (hasSimulationRunToEnd) {
    buttonStyle.backgroundColor = '#28a745'; // Green for "PickUp Order" after completion
  } else if (isSimulating) {
    buttonStyle.backgroundColor = '#ffc107'; // Yellow for "Pause Delivery"
    buttonStyle.color = 'black';
  }
  if (buttonDisabled) {
    buttonStyle.backgroundColor = '#6c757d'; // Grey for disabled
    buttonStyle.cursor = 'not-allowed';
  }

  return (
    <>
      {routePath.length > 0 && (
        <PolylineOnMap path={routePath} strokeColor="#007BFF" strokeWeight={6} strokeOpacity={0.7} />
      )}
      {driverPosition && (
        <Marker
          position={driverPosition}
          title="Driver"
          icon={ (typeof window !== "undefined" && window.google && window.google.maps) ? {
            url: '/driver_marker.png', // Assuming driver_marker.png is in your /public directory
            scaledSize: new window.google.maps.Size(35, 35),
            anchor: new window.google.maps.Point(17, 17),
          } : undefined}
        />
      )}
      <div style={{ position: 'absolute', top: '400px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: 'white', padding: '10px 15px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <button
          onClick={handleToggleSimulation}
          disabled={buttonDisabled}
          style={buttonStyle}
        >
          {buttonText}
        </button>
      </div>
      {showPopupCard && <PopupCard onClose={handlePopupCloseAndRedirect} />}
    </>
  );
}

// --- Main MapComponent ---
export default function MapComponent({ start, destination }: MapComponentProps) {
  const calculatedCenter = start || defaultCenter;
  const [isMapApiLoaded, setIsMapApiLoaded] = useState(false);

  // Determine initial zoom: if showing a route, let fitBounds handle zoom.
  // Otherwise, use a specific zoom level.
  const initialZoom = (start && destination) ? undefined : (start ? 12 : 10);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      onLoad={() => {
        console.log("Google Maps JavaScript API Loaded.");
        setIsMapApiLoaded(true);
      }}
      onError={(e) => console.error("Google Maps APIProvider Error:", e)}
    >
      <div style={{ position: 'relative', width: '100%', height: '500px' }}>
        <Map
          center={calculatedCenter}
          zoom={initialZoom}
          style={{ width: '100%', height: '400px' }}
          disableDefaultUI={false}
          zoomControl={true}
          gestureHandling="greedy"
          mapTypeId="roadmap"
        >
          {start && <Marker position={start} title="Start Location" />}
          {destination && <Marker position={destination} title="Destination Location" />}
          {isMapApiLoaded && start && destination && (
            <RealTimeDirections
              startLocation={start}
              destinationLocation={destination}
            />
          )}
        </Map>
        {!isMapApiLoaded && (
          <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)'}}>
            <p>Loading Map API...</p>
          </div>
        )}
      </div>
    </APIProvider>
  );
}