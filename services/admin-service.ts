import { User, UserRole } from '@/components/providers/auth-provider';
import { Restaurant, Order } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const users: User[] = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    role: 'customer',
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Sara Restaurant',
    email: 'restaurant@example.com',
    role: 'restaurant',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'Dave Driver',
    email: 'driver@example.com',
    role: 'driver',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    profileImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    rating: 4.7,
    deliveryTime: '15-25 min',
    deliveryFee: 2.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '123 Main St, Anytown, CA',
    categories: ['Burgers', 'American', 'Fast Food'],
    isOpen: true
  },
  {
    id: '2',
    name: 'Pizza Planet',
    rating: 4.5,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '456 Oak St, Anytown, CA',
    categories: ['Pizza', 'Italian'],
    isOpen: true
  }
];

const drivers = [
  {
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
    rating: 4.8,
    status: 'active',
    totalDeliveries: 156
  },
  {
    id: '5',
    name: 'Emily Driver',
    email: 'emily@example.com',
    phone: '555-5678',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    vehicle: {
      type: 'Motorcycle',
      make: 'Honda',
      model: 'CBR',
      year: '2020',
      color: 'Red',
      licensePlate: 'XYZ789'
    },
    rating: 4.9,
    status: 'active',
    totalDeliveries: 87
  }
];

const dashboardSummary = {
  totalUsers: 245,
  totalRestaurants: 45,
  totalDrivers: 78,
  totalOrders: 1256,
  revenue: {
    total: 28456.78,
    today: 1245.67,
    thisWeek: 8765.43,
    thisMonth: 28456.78
  },
  recentOrders: 23,
  activeDrivers: 15,
  topRestaurants: [
    { name: 'Burger Palace', orders: 156 },
    { name: 'Pizza Planet', orders: 123 },
    { name: 'Sushi Supreme', orders: 98 }
  ],
  ordersByCategory: [
    { category: 'Fast Food', count: 456 },
    { category: 'Pizza', count: 325 },
    { category: 'Asian', count: 278 },
    { category: 'Mexican', count: 187 },
    { category: 'Healthy', count: 154 }
  ]
};

class AdminService {
  async getDashboardSummary(): Promise<typeof dashboardSummary> {
    await delay(800);
    return dashboardSummary;
  }

  async getUsers(role?: UserRole): Promise<User[]> {
    await delay(500);
    
    if (role) {
      return users.filter(user => user.role === role);
    }
    
    return users;
  }

  async getRestaurants(): Promise<Restaurant[]> {
    await delay(500);
    return restaurants;
  }

  async getDrivers(): Promise<typeof drivers> {
    await delay(500);
    return drivers;
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    await delay(300);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // In a real app, we would update the user status in the database
    // Return the user (we don't actually have a status field in our mock data)
    return users[userIndex];
  }

  async updateRestaurantStatus(restaurantId: string, isApproved: boolean): Promise<Restaurant> {
    await delay(300);
    
    const restaurantIndex = restaurants.findIndex(r => r.id === restaurantId);
    if (restaurantIndex === -1) {
      throw new Error('Restaurant not found');
    }
    
    // In a real app, we would update the restaurant status in the database
    // Return the restaurant (we don't track approval status in our mock data)
    return restaurants[restaurantIndex];
  }

  async updateDriverStatus(driverId: string, status: 'active' | 'inactive' | 'suspended'): Promise<typeof drivers[0]> {
    await delay(300);
    
    const driverIndex = drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      throw new Error('Driver not found');
    }
    
    // Update driver status
    drivers[driverIndex].status = status;
    
    return drivers[driverIndex];
  }
}

export const adminService = new AdminService();