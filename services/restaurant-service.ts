import {Restaurant, MenuItem, Order, OrderStatus} from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const restaurant: Restaurant = {
  id: '1',
  name: 'Burger Palace',
  rating: 4.8,
  deliveryTime: '15-20 min',
  deliveryFee: 2.49,
  image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  logo: '/burger-palace-logo.png',
  coverImage: '/burger-palace-cover.jpg',
  address: '789 Gourmet Avenue, Foodville, CA 92345',
  phone: '(555) 123-4567',
  email: 'info@burgerpalace.com',
  description: 'Serving the juiciest, most delicious gourmet burgers in town since 2015. Our ingredients are locally sourced and our recipes are crafted to perfection.',
  categories: ['Burgers', 'American', 'Fast Food', 'Gourmet'],
  openingHours: {
    monday: '10:00 AM - 10:00 PM',
    tuesday: '10:00 AM - 10:00 PM',
    wednesday: '10:00 AM - 10:00 PM',
    thursday: '10:00 AM - 10:00 PM',
    friday: '10:00 AM - 11:00 PM',
    saturday: '11:00 AM - 11:00 PM',
    sunday: '11:00 AM - 9:00 PM',
  },
  isOpen: true
};

const menuItems: MenuItem[] = [
  {
    id: '101',
    name: 'Classic Royale Burger',
    description: 'Premium Angus beef patty with aged cheddar, crisp lettuce, fresh tomato, and our signature Palace sauce on a toasted brioche bun',
    price: 9.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Signature Burgers'
  },  {
    id: '102',
    name: 'Double Bacon Palace Burger',
    description: 'Two Angus beef patties with crispy applewood smoked bacon, melted American cheese, caramelized onions, and our special Palace sauce',
    price: 13.99,
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Signature Burgers'
  },
  {
    id: '103',
    name: 'Garden Harvest Veggie Burger',
    description: 'House-made plant-based patty with roasted vegetables, avocado, sprouts, and vegan aioli on a multi-grain bun',
    price: 11.99,
    image: 'https://images.pexels.com/photos/3607284/pexels-photo-3607284.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Specialty Burgers'
  },  {
    id: '104',
    name: 'Truffle Parmesan Fries',
    description: 'Hand-cut fries tossed with truffle oil, grated parmesan cheese, and fresh herbs',
    price: 5.99,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Sides'
  },
  {
    id: '105',
    name: 'Crispy Onion Rings',
    description: 'Beer-battered onion rings fried to golden perfection, served with our signature dipping sauce',
    price: 5.99,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: false,
    category: 'Sides'
  },
  {
    id: '106',
    name: 'Signature Chocolate Shake',
    description: 'Rich, velvety chocolate milkshake made with premium ice cream, topped with whipped cream and chocolate shavings',
    price: 5.99,
    image: 'https://images.pexels.com/photos/1148215/pexels-photo-1148215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Shakes & Beverages'
  },
  {
    id: '107',
    name: 'Spicy Southwest Burger',
    description: 'Flame-grilled beef patty with pepper jack cheese, jalapeños, guacamole, and chipotle mayo on a toasted bun',
    price: 12.99,
    image: 'https://images.pexels.com/photos/2725744/pexels-photo-2725744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Signature Burgers'
  },
  {
    id: '108',
    name: 'Loaded Palace Nachos',
    description: 'Crispy tortilla chips topped with melted cheese, seasoned ground beef, jalapeños, sour cream, and pico de gallo',
    price: 9.99,
    image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: false,
    category: 'Appetizers'
  },
  {
    id: '109',
    name: 'California Chicken Sandwich',
    description: 'Grilled chicken breast with avocado, bacon, Swiss cheese, and honey mustard on a ciabatta roll',
    price: 11.99,
    image: 'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: true,
    category: 'Sandwiches'
  },
  {
    id: '110',
    name: 'Strawberry Dream Shake',
    description: 'Fresh strawberry milkshake made with real berries and premium ice cream, topped with whipped cream',
    price: 5.99,
    image: 'https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    popular: false,
    category: 'Shakes & Beverages'
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
        name: 'Classic Royale Burger',
        price: 9.99,
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
  }  async getRestaurantDashboard(restaurantId: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    popularity: number;
    ordersToday: number;
    revenueToday: number;
    weeklyRevenue: { day: string; amount: number }[];
    newCustomers: number;
    repeatCustomers: number;
    popularItems: Array<{name: string, count: number, revenue: number}>;
    recentOrders: Array<{id: string, items: number, total: number, status: string, time: string}>;
  }> {
    await delay(800);
    
    return {
      totalOrders: 3248,
      totalRevenue: 42567.89,
      pendingOrders: 7,
      popularity: 4.8,
      ordersToday: 58,
      revenueToday: 876.45,
      weeklyRevenue: [
        { day: 'Mon', amount: 765.50 },
        { day: 'Tue', amount: 842.75 },
        { day: 'Wed', amount: 917.25 },
        { day: 'Thu', amount: 894.90 },
        { day: 'Fri', amount: 1247.65 },
        { day: 'Sat', amount: 1456.80 },
        { day: 'Sun', amount: 1105.30 }
      ],
      newCustomers: 12,
      repeatCustomers: 46,
      popularItems: [
        { name: 'Classic Royale Burger', count: 412, revenue: 4115.88 },
        { name: 'Double Bacon Palace Burger', count: 385, revenue: 5385.15 },
        { name: 'Truffle Parmesan Fries', count: 527, revenue: 3156.73 },
        { name: 'Signature Chocolate Shake', count: 349, revenue: 2090.51 },
        { name: 'Spicy Southwest Burger', count: 298, revenue: 3870.02 }
      ],
      recentOrders: [
        { id: '6842', items: 3, total: 34.97, status: 'ready', time: '10 minutes ago' },
        { id: '6841', items: 5, total: 62.95, status: 'preparing', time: '25 minutes ago' },
        { id: '6840', items: 2, total: 27.98, status: 'delivered', time: '35 minutes ago' },
        { id: '6839', items: 4, total: 47.96, status: 'delivered', time: '50 minutes ago' },
        { id: '6838', items: 3, total: 33.97, status: 'delivered', time: '1 hour ago' }
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