export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  address: string;
  categories: string[];
  isOpen: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  popular?: boolean;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export type OrderStatus = 
  | 'placed' 
  | 'accepted' 
  | 'preparing' 
  | 'ready' 
  | 'pickedUp' 
  | 'delivered' 
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  estimatedDeliveryTime: string;
  address: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverLocation?: {
    lat: number;
    lng: number;
  };
  timeline: Array<{
    status: OrderStatus;
    time: string;
  }>;
}