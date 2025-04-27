import { Restaurant, MenuItem, Category, Order, OrderStatus } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
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
  },
  {
    id: '3',
    name: 'Sushi Supreme',
    rating: 4.8,
    deliveryTime: '25-40 min',
    deliveryFee: 3.99,
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '789 Maple Ave, Anytown, CA',
    categories: ['Sushi', 'Japanese', 'Asian'],
    isOpen: true
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    rating: 4.3,
    deliveryTime: '15-25 min',
    deliveryFee: 2.49,
    image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '101 Pine St, Anytown, CA',
    categories: ['Mexican', 'Latin American'],
    isOpen: true
  },
  {
    id: '5',
    name: 'Green Garden',
    rating: 4.6,
    deliveryTime: '20-35 min',
    deliveryFee: 3.49,
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '202 Cedar Dr, Anytown, CA',
    categories: ['Vegetarian', 'Healthy', 'Salads'],
    isOpen: true
  },
  {
    id: '6',
    name: 'Noodle House',
    rating: 4.4,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: '303 Birch Ln, Anytown, CA',
    categories: ['Asian', 'Noodles', 'Chinese'],
    isOpen: false
  }
];

const menuItems: Record<string, MenuItem[]> = {
  '1': [ // Burger Palace menu
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
  ],
  '2': [ // Pizza Planet menu
    {
      id: '201',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 12.99,
      image: 'https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      popular: true,
      category: 'Pizza'
    },
    {
      id: '202',
      name: 'Pepperoni Pizza',
      description: 'Pizza with tomato sauce, mozzarella, and pepperoni',
      price: 14.99,
      image: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      popular: true,
      category: 'Pizza'
    },
    {
      id: '203',
      name: 'Garlic Breadsticks',
      description: 'Freshly baked breadsticks with garlic butter and herbs',
      price: 5.99,
      image: 'https://images.pexels.com/photos/1252534/pexels-photo-1252534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      popular: false,
      category: 'Sides'
    }
  ]
};

const categories: Category[] = [
  { id: '1', name: 'Burgers', image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '2', name: 'Pizza', image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '3', name: 'Sushi', image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '4', name: 'Mexican', image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '5', name: 'Healthy', image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '6', name: 'Asian', image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
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
    driverLocation: {
      lat: 37.7749,
      lng: -122.4194
    },
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
    id: '1002',
    customerId: '1',
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
    status: 'pickedUp',
    subtotal: 18.98,
    deliveryFee: 1.99,
    total: 20.97,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    estimatedDeliveryTime: '20-30 min',
    address: '123 Main St, Anytown, CA',
    driverName: 'Dave Driver',
    driverPhone: '555-1234',
    driverLocation: {
      lat: 37.7739,
      lng: -122.4190
    },
    timeline: [
      { status: 'placed', time: new Date(Date.now() - 3600000).toISOString() },
      { status: 'accepted', time: new Date(Date.now() - 3540000).toISOString() },
      { status: 'preparing', time: new Date(Date.now() - 3480000).toISOString() },
      { status: 'ready', time: new Date(Date.now() - 3420000).toISOString() },
      { status: 'pickedUp', time: new Date(Date.now() - 3360000).toISOString() }
    ]
  }
];

class CustomerService {
  async getNearbyRestaurants(): Promise<Restaurant[]> {
    await delay(800);
    return restaurants;
  }

  async getFavoriteRestaurants(customerId: string): Promise<Restaurant[]> {
    await delay(500);
    // For mock data, return a subset of restaurants as "favorites"
    return restaurants.slice(0, 3);
  }

  async getCategories(): Promise<Category[]> {
    await delay(300);
    return categories;
  }

  async searchRestaurants(query: string): Promise<Restaurant[]> {
    await delay(500);
    const lowercaseQuery = query.toLowerCase();
    return restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(lowercaseQuery) || 
      restaurant.categories.some(category => category.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getRestaurantById(restaurantId: string): Promise<Restaurant | null> {
    await delay(300);
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant || null;
  }

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    await delay(500);
    return menuItems[restaurantId] || [];
  }

  async calculateDeliveryFee(address: string): Promise<number> {
    await delay(300);
    // In a real app, this would calculate based on distance, traffic, etc.
    // For mock purposes, return a random fee between $1.99 and $4.99
    return parseFloat((Math.random() * 3 + 1.99).toFixed(2));
  }

  async placeOrder(
    customerId: string, 
    restaurantId: string, 
    items: Array<{id: string, quantity: number}>, 
    address: string
  ): Promise<Order> {
    await delay(1000);
    
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    
    const orderItems = items.map(item => {
      const menuItem = menuItems[restaurantId]?.find(mi => mi.id === item.id);
      if (!menuItem) {
        throw new Error(`Menu item ${item.id} not found`);
      }
      
      return {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        image: menuItem.image
      };
    });
    
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = restaurant.deliveryFee;
    const total = subtotal + deliveryFee;
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      customerId,
      restaurantId,
      restaurantName: restaurant.name,
      items: orderItems,
      status: 'placed',
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: restaurant.deliveryTime,
      address,
      timeline: [
        { status: 'placed', time: new Date().toISOString() }
      ]
    };
    
    // In a real app, we would save this to the database
    orders.push(newOrder);
    
    return newOrder;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    await delay(300);
    const order = orders.find(o => o.id === orderId);
    return order || null;
  }

  async getCurrentOrders(customerId: string): Promise<Order[]> {
    await delay(500);
    return orders.filter(
      order => order.customerId === customerId && 
      ['placed', 'accepted', 'preparing', 'ready', 'pickedUp'].includes(order.status)
    );
  }

  async getPastOrders(customerId: string): Promise<Order[]> {
    await delay(500);
    return orders.filter(
      order => order.customerId === customerId && 
      ['delivered', 'cancelled'].includes(order.status)
    );
  }

  async rateOrder(
    orderId: string, 
    restaurantRating: number, 
    driverRating: number, 
    comment?: string
  ): Promise<void> {
    await delay(500);
    // In a real app, we would save these ratings to the database
    console.log(`Order ${orderId} rated: Restaurant: ${restaurantRating}, Driver: ${driverRating}, Comment: ${comment || 'None'}`);
  }
}

export const customerService = new CustomerService();