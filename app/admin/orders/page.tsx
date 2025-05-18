import { fetchOrders } from '@/lib/api/orderService';
import { Order } from '@/types/order';

export default async function AdminOrdersPage() {
  let orders = [];
  let error = null;

  try {
    orders = await fetchOrders();
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    error = err instanceof Error ? err.message : "Unknown error fetching orders";
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No orders found</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order._id || order.orderNumber} className="border p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-lg">Order #{order.orderNumber}</h2>
              <p>Status: {order.orderStatus}</p>
              <p>Customer ID: {order.customerId}</p>
              <p>Restaurant: {order.restaurantName || order.restaurantId}</p>
              <p>Total: ${order.totalAmount.toFixed(2)}</p>
              <p>Ordered At: {new Date(order.orderTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}
