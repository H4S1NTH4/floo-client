'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const MapComponent = dynamic(() => import('@/components/driver/MapComponent'), { ssr: false });

export default function Home() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div>
      <header className="flex justify-end items-center p-4 bg-white shadow">
        <img
          src="/profile-placeholder.png"
          alt="Profile"
          className="w-10 h-10 rounded-full border"
        />
      </header>

      <main className="flex-1 p-4 flex flex-col items-center">
      <MapComponent />

        {/* Online/Offline Button */}
        <button
          className={`mb-4 px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-gray-400 text-gray-800'
          }`}
          onClick={() => setIsOnline((prev) => !prev)}
        >
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </button>
      </main>

      <footer className="fixed bottom-0 w-full max-w-[430px] bg-white border-t shadow-inner flex justify-around items-center p-4">
        <button className="text-gray-600 hover:text-black">🏠 Home</button>
        <button className="text-gray-600 hover:text-black">🗺️ Map</button>
        <button className="text-gray-600 hover:text-black">⚙️ Settings</button>
      </footer>
    </div>
  );
}
