import { customerService } from '@/services/customer-service';
import OrderDetailsView from '@/components/customer/orders/order-details-view';

export async function generateStaticParams() {
  // Get all orders (both current and past) to generate static paths
  const mockCustomerId = '1'; // Using mock ID since this is for static generation
  const [currentOrders, pastOrders] = await Promise.all([
    customerService.getCurrentOrders(mockCustomerId),
    customerService.getPastOrders(mockCustomerId)
  ]);

  // Combine all orders and extract their IDs
  const allOrders = [...currentOrders, ...pastOrders];
  
  // Create a Set to store unique IDs
  const uniqueIds = new Set([
    ...allOrders.map(order => order.id),
    'order-1745724471643' // Explicitly include the required order ID
  ]);
  
  // Convert Set back to array and map to params object
  return Array.from(uniqueIds).map((id) => ({
    id: id.toString()
  }));
}

export default async function OrderDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const order = await customerService.getOrderById(params.id);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-2">Order not found</h1>
        <p className="text-gray-500 mb-6">
          The order you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  return <OrderDetailsView order={order} />;
}