'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Hardcoded destination (e.g., Galle Face Green, Colombo)
const DESTINATION = {
  lat: 6.927079,
  lng: 79.861244,
};

const MapComponent = dynamic(() => import('@/components/driver/MapComponent'), { ssr: false });

export default function NavigatePage() {
  const [selfLocation, setSelfLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSelfLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Fallback to Colombo if location not available
          setSelfLocation({ lat: 6.9271, lng: 79.8612 });
        }
      );
    } else {
      setSelfLocation({ lat: 6.9271, lng: 79.8612 });
    }
  }, []);

  return (
    <div>
      <header className="flex justify-end items-center p-4 bg-white shadow">
        <img
          src="../../hasintha_profile.png"
          alt="Profile"
          className="w-10 h-10 rounded-full border"
        />
      </header>

      <main className="flex-1 p-4 flex flex-col items-center">
        <div className="w-full">
          {selfLocation ? (
            <MapComponent
              start={selfLocation}
              destination={DESTINATION}
            />
          ) : (
            <div className="flex items-center justify-center h-[400px]">Loading map...</div>
          )}
        </div>
        <div className="mt-6 w-full max-w-2xl flex flex-col gap-2">
         
        </div>
      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t shadow-inner flex justify-around items-center p-4">
        <button className="text-gray-600 hover:text-black">🏠 Home</button>
        <button className="text-gray-600 hover:text-black">🗺️ Map</button>
        <button className="text-gray-600 hover:text-black">⚙️ Settings</button>
      </footer>
    </div>
  );
}