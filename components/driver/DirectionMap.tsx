'use client';

import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState, useCallback } from 'react';


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

    // Ensure Google Maps API is loaded before trying to use it
    if (!window.google || !window.google.maps || !window.google.maps.Polyline) {
      console.warn("Google Maps API not fully loaded for Polyline.");
      // Implement a retry or wait mechanism if necessary, or rely on APIProvider's onLoad
      return;
    }

    const polyline = new window.google.maps.Polyline({
      path,
      geodesic: false, // For driving routes, geodesic is usually false
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

// --- RealTimeDirections Component (can be in its own file) ---
interface RealTimeDirectionsProps {
  startLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
}

function RealTimeDirections({ startLocation, destinationLocation }: RealTimeDirectionsProps) {
  const map = useMap();
  const [routePath, setRoutePath] = useState<{ lat: number; lng: number }[]>([]);
  const [driverPosition, setDriverPosition] = useState<{ lat: number; lng: number } | null>(startLocation);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Effect to fetch directions
  useEffect(() => {
    // Reset state when locations change or map becomes available
    setRoutePath([]);
    setDriverPosition(startLocation);
    setCurrentPathIndex(0);
    setIsSimulating(false);

    if (!map || !startLocation || !destinationLocation) return;

    // Check if DirectionsService is available
    if (!window.google || !window.google.maps || !window.google.maps.DirectionsService) {
      console.warn('DirectionsService not available yet. Waiting for Google Maps API to load fully.');
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
          setDriverPosition(path[0] || startLocation); // Start driver at the beginning of the route
          setCurrentPathIndex(0);

          // Fit map to bounds of the route
          if (result.routes[0].bounds) {
            map.fitBounds(result.routes[0].bounds);
          }
        } else {
          console.error(`Directions request failed due to ${status}`);
          setRoutePath([]); // Clear previous route on error
        }
      }
    );
  }, [map, startLocation, destinationLocation]);

  // Effect to animate the driver
  useEffect(() => {
    if (!isSimulating || routePath.length === 0 || currentPathIndex >= routePath.length -1) {
      if (currentPathIndex >= routePath.length -1 && routePath.length > 0 && isSimulating) {
        setIsSimulating(false); // Stop simulation if already at destination
        console.log("Destination Reached!");
      }
      return; // Exit if not simulating, no path, or at the end
    }

    const simulationSpeed = 10; // Milliseconds per step. Lower is faster.
    const timer = setInterval(() => {
      setCurrentPathIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < routePath.length) {
          const newPosition = routePath[nextIndex];
          setDriverPosition(newPosition);
          // Optionally pan the map to keep the driver in view
          if (map && map.getBounds() && !map.getBounds()!.contains(new window.google.maps.LatLng(newPosition.lat, newPosition.lng))) {
             map.panTo(newPosition);
          }
          return nextIndex;
        }
        // Reached the end of the path
        clearInterval(timer);
        setIsSimulating(false);
        console.log("Destination Reached!");
        return prevIndex; // Keep last index
      });
    }, simulationSpeed);

    return () => clearInterval(timer); // Cleanup interval on unmount or when dependencies change
  }, [isSimulating, routePath, currentPathIndex, map]);

  const handleToggleSimulation = () => {
    if (!isSimulating && routePath.length > 0) {
      // If starting or restarting after reaching the end
      if (currentPathIndex >= routePath.length - 1) {
        setCurrentPathIndex(0);
        setDriverPosition(routePath[0]);
      }
      setIsSimulating(true);
    } else {
      setIsSimulating(false); // Pause simulation
    }
  };
  
  // Custom icon for the driver (simple circle)
  const driverIcon = (typeof window !== "undefined" && window.google && window.google.maps) ? {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: "#FF0000", // Red
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "#FFFFFF", // White border
  } : undefined;


  return (
    <>
      {/* Display the calculated route */}
      {routePath.length > 0 && (
        <PolylineOnMap path={routePath} strokeColor="#007BFF" strokeWeight={6} strokeOpacity={0.7} />
      )}

      {/* Display the driver's marker */}
      {driverPosition && (
        <Marker
          position={driverPosition}
          title="Driver"
         // icon={driverIcon}
          //For a custom image icon:
          icon={{
            url: '../../driver_marker.png', // Place in your public folder
            scaledSize: new window.google.maps.Size(35, 35),
            anchor: new window.google.maps.Point(17, 17), // Center of the icon
          }}
        />
      )}

      {/* UI Button to control simulation */}
      <div style={{ position: 'absolute', top: '400px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: 'white', padding: '10px 15px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <button
          onClick={handleToggleSimulation}
          disabled={routePath.length === 0}
          style={{ fontSize: '1rem', padding: '8px 16px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: isSimulating ? '#dc3545' : '#007bff', color: 'white' }}
        >
          {isSimulating ? 'Pause Delivery' : (currentPathIndex >= routePath.length - 1 && routePath.length > 0 ? 'PickUp Order' : 'Start Trip')}
        </button>
      </div>
    </>
  );
}


// --- Main MapComponent ---
export default function MapComponent({ start, destination }: MapComponentProps) {
  const center = start || defaultCenter;
  const [isMapApiLoaded, setIsMapApiLoaded] = useState(false);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      onLoad={() => {
        console.log("Google Maps JavaScript API Loaded.");
        setIsMapApiLoaded(true);
      }}
      onError={(e) => console.error("Google Maps APIProvider Error:", e)}
    >
      <div style={{ position: 'relative', width: '100%', height: '500px' }}> {/* Ensure container has dimensions */}
        <Map
          //center={center}
          //zoom={start ? 14 : 10} // Zoom in if start is defined, otherwise broader view
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={false}
          zoomControl={true}
          gestureHandling="greedy"
          mapTypeId="roadmap"
          // mapId="YOUR_DEMO_MAP_ID" // Optional: For using cloud-based map styling
        >
          {/* Static Markers for Start and Destination */}
          {start && <Marker position={start} title="Start Location" />}
          {destination && <Marker position={destination} title="Destination Location" />}

          {/* Real-time Directions and Driver Simulation */}
          {isMapApiLoaded && start && destination && (
            <RealTimeDirections
              startLocation={start}
              destinationLocation={destination}
            />
          )}
        </Map>
        {!isMapApiLoaded && (
          <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)'}}>
            <p>Loading Map API...</p>
          </div>
        )}
      </div>
    </APIProvider>
  );
}