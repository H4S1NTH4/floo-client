// Use 'use client' so we can use hooks for real-time order tracking
"use client";

import { useState, useEffect } from "react";
import OrderDetailsView from '@/components/customer/orders/order-details-view';
import { fetchOrderByNumber } from '@/lib/api/orderService';
import { adaptOrderForUI } from '@/lib/adapters/order-adapter';
import { Order as APIOrder } from '@/types/order';
import { Order as UIOrder, OrderStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Dynamic pages can be rendered on request instead of at build time
export const dynamic = 'force-dynamic';

// Helper function to convert status to human-readable text
function getStatusText(status: OrderStatus) {
  switch (status) {
    case 'placed': return 'Order Placed';
    case 'accepted': return 'Accepted';
    case 'preparing': return 'Preparing';
    case 'ready': return 'Ready for Pickup';
    case 'pickedUp': return 'Out for Delivery';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
}

// Client component that handles order tracking and refreshing
export default function OrderDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [order, setOrder] = useState<UIOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const apiOrder = await fetchOrderByNumber(params.id);
      
      if (apiOrder && apiOrder.orderItems) {
        const uiOrder = adaptOrderForUI(apiOrder);
        
        // Check if status has changed
        if (order && order.status !== uiOrder.status) {
          toast({
            title: 'Order Status Updated',
            description: `Your order is now ${getStatusText(uiOrder.status)}`,
          });
        }
        
        setOrder(uiOrder);
      } else {
        setError("Failed to load order details");
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      setError("Something went wrong while loading your order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    
    // Set up periodic polling for active orders
    const intervalId = setInterval(() => {
      // Check if order is in an active status that needs tracking
      if (order && ['placed', 'accepted', 'preparing', 'ready', 'pickedUp'].includes(order.status)) {
        fetchOrderDetails();
      } else {
        // Clear interval if order is complete or cancelled
        clearInterval(intervalId);
      }
    }, 15000); // Check every 15 seconds
    
    // Clean up on component unmount
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, order?.status]);
  
  // Helper function to get status text for notifications
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'placed': return 'Order Placed';
      case 'accepted': return 'Accepted by Restaurant';
      case 'preparing': return 'Being Prepared';
      case 'ready': return 'Ready for Pickup';
      case 'pickedUp': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading && !order) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-2">Order not found</h1>
        <p className="text-gray-500 mb-6">
          The order you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <button 
          onClick={fetchOrderDetails}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <OrderDetailsView 
      order={order} 
      onRefresh={fetchOrderDetails}
      isRefreshing={loading}
    />
  );
}