import { Order } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const availableOrders: Order[] = [
  {
    id: '1003',
    customerId: '1',
    restaurantId: '1',
    restaurantName: 'Burger Palace',
    items: [
      {
        id: '102',
        name: 'Bacon Deluxe Burger',
        price: 10.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: '106',
        name: 'Chocolate Milkshake',
        price: 4.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1148215/pexels-photo-1148215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ],
    status: 'ready',
    subtotal: 15.98,
    deliveryFee: 2.99,
    total: 18.97,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    estimatedDeliveryTime: '15-25 min',
    address: '456 Elm St, Anytown, CA',
    restaurantAddress: '123 Main St, Anytown, CA',
    timeline: [
      { status: 'placed', time: new Date(Date.now() - 1800000).toISOString() },
      { status: 'accepted', time: new Date(Date.now() - 1740000).toISOString() },
      { status: 'preparing', time: new Date(Date.now() - 1680000).toISOString() },
      { status: 'ready', time: new Date(Date.now() - 1620000).toISOString() }
    ]
  },
  {
    id: '1004',
    customerId: '2',
    restaurantId: '2',
    restaurantName: 'Pizza Planet',
    items: [
      {
        id: '201',
        name: 'Margherita Pizza',
        price: 12.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: '203',
        name: 'Garlic Breadsticks',
        price: 5.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1252534/pexels-photo-1252534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ],
    status: 'ready',
    subtotal: 18.98,
    deliveryFee: 1.99,
    total: 20.97,
    createdAt: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
    estimatedDeliveryTime: '20-30 min',
    address: '789 Pine St, Anytown, CA',
    restaurantAddress: '456 Oak St, Anytown, CA',
    timeline: [
      { status: 'placed', time: new Date(Date.now() - 2400000).toISOString() },
      { status: 'accepted', time: new Date(Date.now() - 2340000).toISOString() },
      { status: 'preparing', time: new Date(Date.now() - 2280000).toISOString() },
      { status: 'ready', time: new Date(Date.now() - 2220000).toISOString() }
    ]
  }
];

const activeOrders: Order[] = [];

const completedOrders: Order[] = [
  {
    id: '1001',
    customerId: '1',
    restaurantId: '1',
    restaurantName: 'Burger Palace',
    items: [
      {
        id: '101',
        name: 'Classic Cheeseburger',
        price: 8.99,
        quantity: 2,
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: '104',
        name: 'French Fries',
        price: 3.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ],
    status: 'delivered',
    subtotal: 21.97,
    deliveryFee: 2.99,
    total: 24.96,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    estimatedDeliveryTime: '15-25 min',
    address: '123 Main St, Anytown, CA',
    restaurantAddress: '123 Main St, Anytown, CA',
    driverName: 'Dave Driver',
    driverPhone: '555-1234',
    timeline: [
      { status: 'placed', time: new Date(Date.now() - 86400000).toISOString() },
      { status: 'accepted', time: new Date(Date.now() - 86340000).toISOString() },
      { status: 'preparing', time: new Date(Date.now() - 86280000).toISOString() },
      { status: 'ready', time: new Date(Date.now() - 86220000).toISOString() },
      { status: 'pickedUp', time: new Date(Date.now() - 86160000).toISOString() },
      { status: 'delivered', time: new Date(Date.now() - 86100000).toISOString() }
    ]
  }
];

const driverProfile = {
  id: '3',
  name: 'Dave Driver',
  email: 'driver@example.com',
  phone: '555-1234',
  profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  vehicle: {
    type: 'Car',
    make: 'Toyota',
    model: 'Corolla',
    year: '2018',
    color: 'Silver',
    licensePlate: 'ABC123'
  },
  earnings: {
    today: 45.75,
    thisWeek: 320.50,
    thisMonth: 1250.25
  },
  rating: 4.8,
  totalDeliveries: 156
};

class DriverService {
  async getAvailableOrders(): Promise<Order[]> {
    await delay(800);
    return availableOrders;
  }

  async getActiveOrders(driverId: string): Promise<Order[]> {
    await delay(500);
    return activeOrders;
  }

  async getCompletedOrders(driverId: string): Promise<Order[]> {
    await delay(500);
    return completedOrders;
  }

  async acceptOrder(driverId: string, orderId: string): Promise<Order> {
    await delay(800);
    
    const orderIndex = availableOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found or already taken');
    }
    
    const order = { ...availableOrders[orderIndex] };
    
    // Update driver info on the order
    order.driverId = driverId;
    order.driverName = driverProfile.name;
    order.driverPhone = driverProfile.phone;
    
    // Move to active orders
    activeOrders.push(order);
    availableOrders.splice(orderIndex, 1);
    
    return order;
  }

  async updateOrderStatus(
    driverId: string, 
    orderId: string, 
    status: 'pickedUp' | 'delivered'
  ): Promise<Order> {
    await delay(500);
    
    const orderIndex = activeOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    const order = activeOrders[orderIndex];
    if (order.driverId !== driverId) {
      throw new Error('Order does not belong to this driver');
    }
    
    // Update the order status
    order.status = status;
    
    // Add to timeline
    order.timeline.push({
      status,
      time: new Date().toISOString()
    });
    
    // If delivered, move to completed orders
    if (status === 'delivered') {
      completedOrders.push(order);
      activeOrders.splice(orderIndex, 1);
    }
    
    return order;
  }

  async updateDriverLocation(
    driverId: string, 
    location: { lat: number; lng: number }
  ): Promise<void> {
    await delay(200);
    
    // In a real app, we would update the driver's location in the database
    // For active orders, update the driver location
    activeOrders.forEach(order => {
      if (order.driverId === driverId) {
        order.driverLocation = location;
      }
    });
  }

  async getDriverProfile(driverId: string): Promise<typeof driverProfile> {
    await delay(300);
    return driverProfile;
  }

  async updateDriverProfile(driverId: string, updates: Partial<typeof driverProfile>): Promise<typeof driverProfile> {
    await delay(500);
    
    // In a real app, we would update the driver's profile in the database
    Object.assign(driverProfile, updates);
    
    return driverProfile;
  }

  async updateVehicleInfo(
    driverId: string, 
    vehicleInfo: Partial<typeof driverProfile.vehicle>
  ): Promise<typeof driverProfile.vehicle> {
    await delay(500);
    
    // In a real app, we would update the driver's vehicle info in the database
    Object.assign(driverProfile.vehicle, vehicleInfo);
    
    return driverProfile.vehicle;
  }
}

export const driverService = new DriverService();