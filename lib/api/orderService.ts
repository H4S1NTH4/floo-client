import { CreateOrderRequest } from '@/types/order';

// Extract the base URL for consistency across all API calls
const extractBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || '';
  if (!url) {
    console.error('ORDER_SERVICE_URL is not defined in environment variables');
    return 'http://localhost:8080/order-service/api/v1/order'; // Fallback URL
  }
  return url;
};

// Log the full URL for debugging purposes
const logRequestUrl = (url: string) => {
  console.log(`Making API request to: ${url}`);
};

// Fetch orders by order number
export const fetchOrderByNumber = async (orderNumber: string) => {
  try {
    const apiUrl = extractBaseUrl();
    const res = await fetch(`${apiUrl}/number/${orderNumber}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch order by number: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching order with number ${orderNumber}:`, error);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    const apiUrl = extractBaseUrl();
    const res = await fetch(`${apiUrl}/allOrders`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' } 
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchOrderById = async (id: string) => {
  try {
    const apiUrl = extractBaseUrl();
    const res = await fetch(`${apiUrl}/${id}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' } 
    });
    if (!res.ok) {
      throw new Error('Failed to fetch order');
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData: CreateOrderRequest) => {
  try {
    const apiUrl = extractBaseUrl();
    console.log(`Creating order with URL: ${apiUrl}`);
    
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    // Log response information for debugging
    console.log(`Order API response status: ${res.status}`);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No response body');
      console.error(`Order API error response: ${errorText}`);
      throw new Error(`Failed to create order: HTTP ${res.status} - ${res.statusText}`);
    }

    try {
      const jsonData = await res.json();
      console.log("Order API response data:", jsonData);
      return jsonData;
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      // Return a minimal object that won't crash our app
      return { orderNumber: orderData.orderNumber, error: "Failed to parse response" };
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchOrdersByCustomerId = async (customerId: string) => {
  try {
    const apiUrl = extractBaseUrl();
    const res = await fetch(`${apiUrl}/customer/${customerId}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' } 
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch customer orders: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    throw error;
  }
};

// Fetch orders by status
export const fetchOrdersByStatus = async (status: string) => {
  try {
    const apiUrl = extractBaseUrl();
    const res = await fetch(`${apiUrl}/status/${status}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' } 
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch orders by status ${status}: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error);
    throw error;
  }
};

// Fetch orders by restaurant ID (matches Postman: /api/v1/order/restaurant/{restaurantId})
export const fetchOrdersByRestaurantId = async (restaurantId: string) => {
  try {
    const apiUrl = extractBaseUrl();
    const requestUrl = `${apiUrl}/restaurant/${restaurantId}`;
    logRequestUrl(requestUrl);
    const res = await fetch(requestUrl, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`Restaurant orders API response status: ${res.status}`);
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No response body');
      console.error(`Restaurant orders API error response:`, errorText);
      throw new Error(`Failed to fetch restaurant orders: HTTP ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`Restaurant orders received:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching orders for restaurant ${restaurantId}:`, error);
    throw error;
  }
};

// Update order status (matches Postman: PATCH /api/v1/order/{orderId}/status)
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    // Validate the order ID
    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      console.error('Invalid order ID provided:', orderId);
      throw new Error('Invalid order ID provided. Order ID is required and must be a string.');
    }
    
    const apiUrl = extractBaseUrl();
    const requestUrl = `${apiUrl}/${orderId}/status`;
    logRequestUrl(requestUrl);
    console.log(`Attempting to update order ${orderId} to status: ${status}`);
    console.log(`Request body: ${JSON.stringify({ orderStatus: status })}`);
    
    const res = await fetch(requestUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderStatus: status })
    });
    console.log(`Update order status API response status: ${res.status}`);
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No response body');
      console.error(`Update status API error response:`, errorText);
      throw new Error(`Failed to update order status: HTTP ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`Order status update response:`, data);
    return data;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error;
  }
};