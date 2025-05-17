'use client';

import { useState, useEffect } from 'react';
import { fetchOrdersByStatus } from '@/lib/api/orderService';
import { Order } from '@/types/order';

export default function TestOrderStatus() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string>('READY');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const statuses = [
    'PENDING', 
    'ACCEPTED', 
    'DENIED', 
    'PREPARING', 
    'READY', 
    'PICKED_UP', 
    'DELIVERING', 
    'DELIVERED', 
    'COMPLETED', 
    'CANCELLED'
  ];

  const fetchOrders = async (selectedStatus: string) => {
    setLoading(true);
    setError(null);    try {
      const data = await fetchOrdersByStatus(selectedStatus);
      setOrders(Array.isArray(data) ? data : []);
      setLastFetched(new Date());
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(status);
  }, [status]);

  return (
    <div className="container mx-auto p-4">      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Test Order Status Fetching</h1>
        <button 
          onClick={() => fetchOrders(status)} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
          {!loading && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Order Status:
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => setStatus(statusOption)}
              className={`px-3 py-1 rounded-md text-sm ${
                status === statusOption 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {statusOption}
            </button>
          ))}
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
        {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Error: {error}</p>
          <p className="text-sm mt-1">Please try again or check your connection.</p>
        </div>
      )}
      
      {lastFetched && (
        <div className="text-sm text-gray-500 mb-4">
          Last updated: {lastFetched.toLocaleString()}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {orders.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order._id} className="px-6 py-4 hover:bg-gray-50">                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">Restaurant: {order.restaurantName || order.restaurantId}</p>
                    <p className="text-sm text-gray-500">
                      Customer: {order.customerId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="font-medium">{order.orderStatus}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Total Amount: ${typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      {
                        'PENDING': 'bg-yellow-100 text-yellow-800',
                        'ACCEPTED': 'bg-green-100 text-green-800',
                        'DENIED': 'bg-red-100 text-red-800',
                        'PREPARING': 'bg-blue-100 text-blue-800',
                        'READY': 'bg-purple-100 text-purple-800',
                        'PICKED_UP': 'bg-indigo-100 text-indigo-800',
                        'DELIVERING': 'bg-pink-100 text-pink-800',
                        'DELIVERED': 'bg-green-100 text-green-800',
                        'COMPLETED': 'bg-gray-100 text-gray-800',
                        'CANCELLED': 'bg-red-100 text-red-800',
                      }[order.orderStatus]
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Items: {order.orderItems.length}</p>                  <ul className="pl-5 list-disc text-xs text-gray-500 mt-1">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <li key={index}>
                        {item.name} x {item.quantity} - ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      </li>
                    ))}
                    {order.orderItems.length > 3 && (
                      <li>...and {order.orderItems.length - 3} more items</li>
                    )}
                  </ul>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Order time: {new Date(order.orderTime).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>        ) : !loading && (
          <div className="text-center py-8 text-gray-500">
            No orders found with status &quot;{status}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
