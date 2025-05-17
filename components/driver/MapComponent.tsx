'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';

const defaultCenter = {
  lat: 6.9271, // Colombo, Sri Lanka
  lng: 79.8612,
};

export default function SimpleMap() {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <div style={{ width: '100%', height: '500px' }}>
        <Map
          //center={defaultCenter}
          //zoom={30}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={false} // Enables default UI controls
          zoomControl={true}       // Specifically enables zoom control
          gestureHandling="greedy"
          mapTypeId="roadmap"
          
        />
      </div>
    </APIProvider>
  );
}
