'use client';

import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

interface MapComponentProps {
  start?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
}

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

function PolylineOnMap({ path }: { path: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map || path.length < 2) return;
    const polyline = new window.google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#4285F4',
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });
    polyline.setMap(map);
    return () => {
      polyline.setMap(null);
    };
  }, [map, path]);
  return null;
}

export default function MapComponent({ start, destination }: MapComponentProps) {
  const center = start || defaultCenter;
  const path = start && destination ? [start, destination] : [];

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <div style={{ width: '100%', height: '400px' }}>
        <Map
          center={center}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={false}
          zoomControl={true}
          gestureHandling="greedy"
          mapTypeId="roadmap"
          //zoom={14}
        >
          {start && <Marker position={start} />}
          {destination && <Marker position={destination} />}
          {path.length === 2 && <PolylineOnMap path={path} />}
        </Map>
      </div>
    </APIProvider>
  );
}