import {Restaurant, MenuItem, Order, OrderStatus} from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const restaurant: Restaurant = {
  id: '1',
  name: 'Burger Palace',
  rating: 4.7,
  deliveryTime: '15-25 min',
  deliveryFee: 2.99,
  image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  address: '123 Main St, Anytown, CA',
  categories: ['Burgers', 'American', 'Fast Food'],
  isOpen: true
};

const menuItems: MenuItem[] = [
  {
    id: '101',
    name: 'Classic Cheeseburger',
    description: 'Beef patty with cheddar cheese, lettuce, tomato, and special sauce',
    price: 8.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Burgers'
  },
  {
    id: '102',
    name: 'Bacon Deluxe Burger',
    description: 'Beef patty with bacon, cheddar, lettuce, tomato, and BBQ sauce',
    price: 10.99,
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Burgers'
  },
  {
    id: '103',
    name: 'Veggie Burger',
    description: 'Plant-based patty with lettuce, tomato, onion, and vegan mayo',
    price: 9.99,
    image: 'https://images.pexels.com/photos/3607284/pexels-photo-3607284.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: false,
    category: 'Burgers'
  },
  {
    id: '104',
    name: 'French Fries',
    description: 'Crispy golden fries seasoned with salt',
    price: 3.99,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Sides'
  },
  {
    id: '105',
    name: 'Onion Rings',
    description: 'Crispy battered onion rings served with dipping sauce',
    price: 4.99,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: false,
    category: 'Sides'
  },
  {
    id: '106',
    name: 'Chocolate Milkshake',
    description: 'Creamy chocolate milkshake topped with whipped cream',
    price: 4.99,
    image: 'https://images.pexels.com/photos/1148215/pexels-photo-1148215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Beverages'
  }
];

const orders: Order[] = [
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
  },
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
    status: 'placed',
    subtotal: 15.98,
    deliveryFee: 2.99,
    total: 18.97,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    estimatedDeliveryTime: '15-25 min',
    address: '456 Elm St, Anytown, CA',
    timeline: [
      { status: 'placed', time: new Date(Date.now() - 1800000).toISOString() }
    ]
  }
];

class RestaurantService {
  async getRestaurantById(restaurantId: string): Promise<Restaurant | null> {
    await delay(300);
    // For mock purposes, always return the same restaurant
    return restaurant;
  }

  async getRestaurantDashboard(restaurantId: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    popularItems: Array<{name: string, count: number}>;
  }> {
    await delay(800);
    
    return {
      totalOrders: 156,
      totalRevenue: 3245.67,
      pendingOrders: 3,
      popularItems: [
        { name: 'Classic Cheeseburger', count: 78 },
        { name: 'Bacon Deluxe Burger', count: 45 },
        { name: 'French Fries', count: 92 },
        { name: 'Chocolate Milkshake', count: 34 }
      ]
    };
  }

  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    await delay(500);
    return menuItems;
  }

  async addMenuItem(restaurantId: string, item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    await delay(800);
    
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    
    // In a real app, we would save this to the database
    menuItems.push(newItem);
    
    return newItem;
  }

  async updateMenuItem(restaurantId: string, itemId: string, item: Partial<MenuItem>): Promise<MenuItem> {
    await delay(500);
    
    const index = menuItems.findIndex(mi => mi.id === itemId);
    if (index === -1) {
      throw new Error('Menu item not found');
    }
    
    const updatedItem = {
      ...menuItems[index],
      ...item
    };
    
    // Update the item in our "database"
    menuItems[index] = updatedItem;
    
    return updatedItem;
  }

  async deleteMenuItem(restaurantId: string, itemId: string): Promise<void> {
    await delay(500);
    
    const index = menuItems.findIndex(mi => mi.id === itemId);
    if (index === -1) {
      throw new Error('Menu item not found');
    }
    
    // Remove the item from our "database"
    menuItems.splice(index, 1);
  }

  async updateRestaurantStatus(restaurantId: string, isOpen: boolean): Promise<Restaurant> {
    await delay(300);
    
    // Update the restaurant status
    restaurant.isOpen = isOpen;
    
    return restaurant;
  }

  async getPendingOrders(restaurantId: string): Promise<Order[]> {
    await delay(500);
    return orders.filter(
      order => order.restaurantId === restaurantId && 
      ['placed'].includes(order.status)
    );
  }

  async getActiveOrders(restaurantId: string): Promise<Order[]> {
    await delay(500);
    return orders.filter(
      order => order.restaurantId === restaurantId && 
      ['accepted', 'preparing', 'ready', 'pickedUp'].includes(order.status)
    );
  }

  async getPastOrders(restaurantId: string): Promise<Order[]> {
    await delay(500);
    return orders.filter(
      order => order.restaurantId === restaurantId && 
      ['delivered', 'cancelled'].includes(order.status)
    );
  }

  async updateOrderStatus(
      restaurantId: string,
      orderId: string,
      status: OrderStatus
  ): Promise<Order> {
    await delay(500);
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = orders[orderIndex];
    if (order.restaurantId !== restaurantId) {
      throw new Error('Order does not belong to this restaurant');
    }
    
    // Update the order status
    order.status = status;
    
    // Add to timeline
    order.timeline.push({
      status,
      time: new Date().toISOString()
    });
    
    return order;
  }
}

export const restaurantService = new RestaurantService();