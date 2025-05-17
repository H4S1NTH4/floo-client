import { Order as APIOrder } from '@/types/order';
import { Order as UIOrder, OrderStatus } from '@/types';

// Adapter function to convert API Order type to the expected UI Order type
export const adaptOrderForUI = (apiOrder: APIOrder): UIOrder => {
  // Map status from API format (UPPERCASE) to UI format (lowercase)
  const mapStatus = (apiStatus: string): OrderStatus => {
    const statusMap: Record<string, OrderStatus> = {
      'PENDING': 'placed',
      'ACCEPTED': 'accepted', 
      'PREPARING': 'preparing',
      'READY': 'ready',
      'PICKED_UP': 'pickedUp',
      'DELIVERING': 'pickedUp', // Map to closest UI status
      'DELIVERED': 'delivered',
      'COMPLETED': 'delivered', // Map to closest UI status
      'CANCELLED': 'cancelled'
    };
    
    return statusMap[apiStatus] || 'placed';
  };

  return {
    id: apiOrder._id || apiOrder.orderNumber.toString(),
    customerId: apiOrder.customerId,
    restaurantId: apiOrder.restaurantId,
    restaurantName: apiOrder.restaurantName || 'Restaurant',
    restaurantAddress: apiOrder.restaurantAddress,
    items: apiOrder.orderItems.map(item => ({
      id: item.id || item.foodItemId || '',
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.imageUrl || item.image
    })),
    status: mapStatus(apiOrder.orderStatus),
    subtotal: apiOrder.subTotal,
    deliveryFee: apiOrder.deliveryFee,
    total: apiOrder.totalAmount,
    createdAt: new Date(apiOrder.orderTime).toISOString(),
    estimatedDeliveryTime: new Date(apiOrder.deliveryTime).toISOString(),
    address: apiOrder.deliveryAddress,
    timeline: generateTimeline(apiOrder),
    driverId: apiOrder.userId || undefined,
    driverName: undefined, // API doesn't provide driver name
    driverPhone: undefined // API doesn't provide driver phone number
  };
};

// Generate a timeline based on the order status
export const generateTimeline = (apiOrder: APIOrder): Array<{status: OrderStatus; time: string}> => {
  const timeline: Array<{status: OrderStatus; time: string}> = [];
  const orderTime = new Date(apiOrder.orderTime).toISOString();
  
  // Always add placed status
  timeline.push({ 
    status: 'placed', 
    time: orderTime 
  });
  
  // Generate additional timeline entries based on order status
  const currentStatus = apiOrder.orderStatus;
  const timeNow = new Date().toISOString();
  
  // Generate timeline entries based on the current status
  // This simulates the progression through different statuses
  if (['ACCEPTED', 'PREPARING', 'READY', 'PICKED_UP', 'DELIVERING', 'DELIVERED', 'COMPLETED'].includes(currentStatus)) {
    timeline.push({ status: 'accepted', time: timeNow });
  }
  
  if (['PREPARING', 'READY', 'PICKED_UP', 'DELIVERING', 'DELIVERED', 'COMPLETED'].includes(currentStatus)) {
    timeline.push({ status: 'preparing', time: timeNow });
  }
  
  if (['READY', 'PICKED_UP', 'DELIVERING', 'DELIVERED', 'COMPLETED'].includes(currentStatus)) {
    timeline.push({ status: 'ready', time: timeNow });
  }
  
  if (['PICKED_UP', 'DELIVERING', 'DELIVERED', 'COMPLETED'].includes(currentStatus)) {
    timeline.push({ status: 'pickedUp', time: timeNow });
  }
  
  if (['DELIVERED', 'COMPLETED'].includes(currentStatus)) {
    timeline.push({ status: 'delivered', time: timeNow });
  }
  
  return timeline;
};
