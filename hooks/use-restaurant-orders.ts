import { useCallback, useState, useEffect, useRef } from 'react';
import { fetchOrdersByRestaurantId, updateOrderStatus } from '@/lib/api/orderService';
import { Order } from '@/types/order';

interface UseRestaurantOrdersOptions {
  restaurantId: string;
  pollingInterval?: number;
  enablePolling?: boolean;
}

export const useRestaurantOrders = ({ 
  restaurantId,
  pollingInterval = 10000, // Default to 10 seconds
  enablePolling = true
}: UseRestaurantOrdersOptions) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Track "isUpdating" state separately from "loading" initial state
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Use a ref to store the polling interval ID so it persists across renders
  const pollingIntervalId = useRef<NodeJS.Timeout | null>(null);
  
  // Cache the previous data in case of fetch failures
  const cachedDataRef = useRef<{
    orders: Order[];
    activeOrders: Order[];
    completedOrders: Order[];
    cancelledOrders: Order[];
  } | null>(null);
  
  // Function to fetch orders
  const fetchOrders = useCallback(async (showLoaderUI = true) => {
    if (showLoaderUI) {
      setIsUpdating(true);
    }
    
    try {
      setError(null);
      console.log(`Fetching orders for restaurant ID: ${restaurantId}`);
      const fetchedOrders = await fetchOrdersByRestaurantId(restaurantId);
      console.log(`Fetched ${fetchedOrders.length} orders for restaurant ${restaurantId}`);
      
      // Normalize orders to ensure all have consistent ID field
      // API returns 'id' but our frontend code expects '_id'
      const normalizedOrders = fetchedOrders.map((order: Order) => {
        if (order.id && !order._id) {
          return { ...order, _id: order.id };
        }
        return order;
      });
      console.log(`Normalized ${normalizedOrders.length} orders with consistent ID fields`);
      
      // Set all orders
      setOrders(normalizedOrders);
      
      // Divide orders by status
      const active = normalizedOrders.filter((order: Order) => 
        ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'PICKED_UP', 'DELIVERING'].includes(order.orderStatus)
      );
      
      const completed = normalizedOrders.filter((order: Order) => 
        ['DELIVERED', 'COMPLETED'].includes(order.orderStatus)
      );
      
      const cancelled = normalizedOrders.filter((order: Order) => 
        order.orderStatus === 'CANCELLED' || order.orderStatus === 'DENIED'
      );
      
      setActiveOrders(active);
      setCompletedOrders(completed);
      setCancelledOrders(cancelled);
      
      console.log(`Orders categorized: Active: ${active.length}, Completed: ${completed.length}, Cancelled: ${cancelled.length}`);
      
      // Store data in cache
      cachedDataRef.current = {
        orders: normalizedOrders,
        activeOrders: active,
        completedOrders: completed,
        cancelledOrders: cancelled
      };
      
      // Update last refreshed timestamp
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      
      console.error('Error fetching restaurant orders:', err);
      
      // If we have cached data, restore it
      if (cachedDataRef.current) {
        console.log('Using cached order data due to fetch error');
        setOrders(cachedDataRef.current.orders);
        setActiveOrders(cachedDataRef.current.activeOrders);
        setCompletedOrders(cachedDataRef.current.completedOrders);
        setCancelledOrders(cachedDataRef.current.cancelledOrders);
      }
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  }, [restaurantId]);
  
  // Update order status function
  const updateOrder = useCallback(async (orderId: string, newStatus: string) => {
    try {
      if (!orderId) {
        throw new Error('Order ID is required but was not provided');
      }
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      await updateOrderStatus(orderId, newStatus);
      
      // Re-fetch orders to get the updated list
      fetchOrders(false); // Don't show loading indicator
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      setError(errorMessage);
      console.error('Error updating order status:', err);
      return false;
    }
  }, [fetchOrders]);
  
  // Start polling effect
  useEffect(() => {
    // Initial fetch
    fetchOrders();
    
    // Set up polling if enabled
    if (enablePolling) {
      pollingIntervalId.current = setInterval(
        () => fetchOrders(false), // Don't show loading indicator for automatic polling
        pollingInterval
      );
    }
    
    // Clean up on unmount
    return () => {
      if (pollingIntervalId.current) {
        clearInterval(pollingIntervalId.current);
      }
    };
  }, [restaurantId, pollingInterval, fetchOrders, enablePolling]);
  
  return {
    orders,
    activeOrders,
    completedOrders,
    cancelledOrders,
    loading,
    isUpdating,
    error,
    lastUpdated,
    refreshOrders: () => fetchOrders(true), // Show loading when manually refreshed
    updateOrderStatus: updateOrder
  };
};
