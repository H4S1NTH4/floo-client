import { CreateOrderRequest } from '@/types/order';

// Extract the base URL for consistency across all API calls
const extractBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || '';
  if (!url) {
    console.error('ORDER_SERVICE_URL is not defined in environment variables');
    return 'http://localhost:8082/api/v1/order'; // Fallback URL
  }
  return url;
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