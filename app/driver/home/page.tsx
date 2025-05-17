'use client';

import dynamic from 'next/dynamic';
import { useState,useEffect } from 'react';
import { DriverStatus } from '@/types/driver';
import { updateDriverStatus } from '@/lib/api/deliveryService';
import {fetchOrdersByStatus} from '@/lib/api/orderService';


const MapComponent = dynamic(() => import('@/components/driver/MapComponent'), { ssr: false });
const AcceptOrderCard = dynamic(() => import('@/components/driver/AcceptOrderCard'), { ssr: false });

export default function Home() {
  const [isOnline, setIsOnline] = useState(false);
  const [showOrderCard, setShowOrderCard] = useState(false);
  const [order, setOrder] = useState<any>(null);

    // Poll for READY orders every 10 seconds when online
    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isOnline) {
        const fetchOrder = async () => {
          try {
            const orders = await fetchOrdersByStatus('READY');
            if (orders && orders.length > 0) {
              setOrder(orders[0]); // Show the first available order
            } else {
              setOrder(null);
            }
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        };
        fetchOrder();
        interval = setInterval(fetchOrder, 10000);
      } else {
        setOrder(null);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isOnline]);

  const handleOnlineClick = async () =>  {
    setIsOnline(!isOnline);
    setShowOrderCard(true);

    const driverId = "6826199186c67747e579e3db"; // Replace with actual driver ID
    const newStatus = !isOnline ? DriverStatus.ONLINE : DriverStatus.OFFLINE;
    try {
      const updatedDriver = await updateDriverStatus(driverId, newStatus);
      if (updatedDriver) {
      
      } else {
        console.error("Failed to update driver status");
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  };
  const handleAccept = async () => {
    const driverId = "6826199186c67747e579e3db"; // Replace with actual driver ID
    
    try {
      const updatedDriver = await updateDriverStatus(driverId, DriverStatus.DELIVERY);
      if (updatedDriver) {
        console.log('Order accepted and status updated to DELIVERY');
        setShowOrderCard(false);
        setIsOnline(false); // Optionally update the online status
      } else {
        console.error("Failed to update driver status to DELIVERY");
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  };

  const handleDecline = () => {
    console.log('Order declined');
    setOrder(null);
  };

  return (
    <div >
      <header className="flex justify-end items-center p-4 bg-white shadow">
        <img
          src="../../hasintha_profile.png"
          alt="Profile"
          className="w-10 h-10 rounded-full border"
        />
      </header>

      <main className="flex-1 p-4 flex flex-col items-center">
      <MapComponent />
      {/* <AcceptOrderCard /> */}

        {/* Online/Offline Button */}
        <button
          className={`mb-4 px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-gray-400 text-gray-800'
          }`}
          onClick={handleOnlineClick}
        >
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </button>
        {/* Show order card if order data is available */}
        {order && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <AcceptOrderCard
                order={order}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t shadow-inner flex justify-around items-center p-4">
        <button className="text-gray-600 hover:text-black">🏠 Home</button>
        <button className="text-gray-600 hover:text-black">🗺️ Map</button>
        <button className="text-gray-600 hover:text-black">⚙️ Settings</button>
      </footer>
    </div>
  );
}
