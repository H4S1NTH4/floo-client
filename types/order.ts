export type OrderItem = {
  id: string;
  foodItemId?: string; // Added for server compatibility
  name: string;
  price: number;
  quantity: number;
  image?: string;
  imageUrl?: string; // Added for server compatibility
};

export type Order = {
    _id?: string;
    orderNumber: number;
    customerId: string;
    restaurantId: string;
    restaurantName?: string;
    orderItems: OrderItem[];
    subTotal: number;
    deliveryFee: number;
    totalAmount: number;
    orderTime: number;
    deliveryAddress: string;
    restaurantAddress: string;
    deliveryTime: number;
    orderStatus:
        | 'PENDING'        // Order created, awaiting payment
        | 'ACCEPTED'       // Order accepted by restaurant
        | 'DENIED'         // Order denied by restaurant
        | 'PREPARING'      // Order is being prepared
        | 'READY'          // Order is ready for pickup or delivery
        | 'PICKED_UP'      // Order has left for delivery
        | 'DELIVERING'     // Currently being delivered
        | 'DELIVERED'      // Items have been delivered
        | 'COMPLETED'      // Payment completed and process finalized
        | 'CANCELLED';     // Order was cancelled
    paymentId: string;
    userId: string;
};

export type CreateOrderRequest = {
  orderNumber: number;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  orderItems: OrderItem[];
  subTotal: number;
  deliveryFee: number;
  totalAmount: number;
  orderTime: number;
  deliveryAddress: string;
  restaurantAddress: string;
  deliveryTime: number;
  orderStatus: string;
  paymentId: string;
  userId: string;
}; 
