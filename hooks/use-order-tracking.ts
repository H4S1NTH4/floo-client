"use client";

import { useState, useEffect, useRef } from 'react';
import { Order as APIOrder } from '@/types/order';
import { Order as UIOrder } from '@/types';
import { fetchOrderByNumber } from '@/lib/api/orderService';
import { adaptOrderForUI } from '@/lib/adapters/order-adapter'; // We'll create this next

// Define completed statuses that should stop polling
const COMPLETED_STATUSES = ['DELIVERED', 'COMPLETED', 'CANCELLED'];

interface UseOrderTrackingOptions {
  pollingInterval?: number; // in milliseconds
  onStatusChange?: (newOrder: UIOrder, previousOrder: UIOrder | null) => void;
}

export function useOrderTracking(
  orderNumber: string,
  initialOrder: UIOrder | null = null,
  options: UseOrderTrackingOptions = {}
) {
  const { 
    pollingInterval = 10000, // Default to checking every 10 seconds
    onStatusChange 
  } = options;
  
  const [order, setOrder] = useState<UIOrder | null>(initialOrder);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const previousOrderRef = useRef<UIOrder | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to fetch the latest order data
  const fetchLatestOrderData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiOrder = await fetchOrderByNumber(orderNumber);
      const updatedOrder = adaptOrderForUI(apiOrder);
      
      // Check if status has changed
      if (previousOrderRef.current?.status !== updatedOrder.status && onStatusChange) {
        onStatusChange(updatedOrder, previousOrderRef.current);
      }
      
      previousOrderRef.current = updatedOrder;
      setOrder(updatedOrder);
      
      return updatedOrder;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch order'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start polling
  const startPolling = () => {
    // Clear any existing interval
    stopPolling();
    
    // Set up new polling interval
    pollingRef.current = setInterval(async () => {
      const updatedOrder = await fetchLatestOrderData();
      
      // Stop polling if order is completed
      if (updatedOrder && COMPLETED_STATUSES.includes(updatedOrder.status.toUpperCase())) {
        stopPolling();
      }
    }, pollingInterval);
  };
  
  // Stop polling
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };
  
  // Manual refresh function that can be called on demand
  const refreshOrder = async () => {
    return fetchLatestOrderData();
  };
  
  // Set up polling when component mounts
  useEffect(() => {
    // Fetch immediately
    fetchLatestOrderData();
    
    // Then start polling
    startPolling();
    
    // Clean up when component unmounts
    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);
  
  return {
    order,
    isLoading,
    error,
    refreshOrder,
    startPolling,
    stopPolling,
  };
}
