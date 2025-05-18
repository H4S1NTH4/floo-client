"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { fetchOrdersByRestaurantId, updateOrderStatus } from '@/lib/api/orderService';
import { Order } from '@/types/order';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ApiDebugPage() {
  const [restaurantId, setRestaurantId] = useState<string>("1");
  const [orderId, setOrderId] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("READY");
  const [orders, setOrders] = useState<Order[]>([]);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("fetch");
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:8082');
  const [customEndpoint, setCustomEndpoint] = useState('/api/v1/order/restaurant/1');
  const [customMethod, setCustomMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('{\n  "orderStatus": "PREPARING"\n}');
  const [statusCode, setStatusCode] = useState<number | null>(null);

  // Available status options for orders
  const statusOptions = [
    "PENDING", "ACCEPTED", "PREPARING", "READY", "PICKED_UP", 
    "DELIVERING", "DELIVERED", "COMPLETED", "CANCELLED", "DENIED"
  ];

  const handleFetchOrders = async () => {
    setLoading(true);
    setError(null);
    setApiResponse("");
    setOrders([]);
    
    try {
      console.log(`Fetching orders for restaurant ID: ${restaurantId}`);
      const data = await fetchOrdersByRestaurantId(restaurantId);
      setOrders(data);
      setApiResponse(JSON.stringify(data, null, 2));
      console.log('Orders fetched successfully:', data);
      toast({
        title: "Orders Fetched",
        description: `Successfully fetched ${data.length} orders`,
        variant: "default",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Error in fetch orders:', err);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!orderId) {
      setError("Order ID is required");
      toast({
        title: "Error",
        description: "Order ID is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setApiResponse("");
    
    try {
      console.log(`Updating order ${orderId} status to ${newStatus}`);
      const data = await updateOrderStatus(orderId, newStatus);
      setApiResponse(JSON.stringify(data, null, 2));
      console.log('Order status updated successfully:', data);
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
        variant: "default",
      });
      
      // Refresh orders list after update
      handleFetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Error updating order status:', err);
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomRequest = async () => {
    setLoading(true);
    setError(null);
    setApiResponse("");
    setStatusCode(null);

    try {
      const fullUrl = `${apiUrl}${customEndpoint}`;
      console.log(`Sending ${customMethod} request to ${fullUrl}`);
      
      const options: RequestInit = {
        method: customMethod,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (customMethod !== 'GET' && customMethod !== 'HEAD') {
        options.body = requestBody;
      }
      
      const res = await fetch(fullUrl, options);
      setStatusCode(res.status);
      
      const data = await res.json().catch(() => ({ message: "No JSON response" }));
      setApiResponse(JSON.stringify(data, null, 2));
      
      if (!res.ok) {
        setError(`Request failed with status: ${res.status}`);
        toast({
          title: `Error ${res.status}`,
          description: res.statusText,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Request Successful",
          description: `Status: ${res.status}`,
          variant: "default",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      console.error('API Request Error:', err);
      toast({
        title: "Request Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setOrderId(order._id || "");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">API Debug Tool</h1>
      
      <Tabs defaultValue="fetch" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="fetch">Fetch Orders</TabsTrigger>
          <TabsTrigger value="update">Update Order</TabsTrigger>
          <TabsTrigger value="custom">Custom Request</TabsTrigger>
        </TabsList>
        
        {/* Fetch Orders Tab */}
        <TabsContent value="fetch">
          <Card>
            <CardHeader>
              <CardTitle>Fetch Restaurant Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Restaurant ID:</label>
                <div className="flex gap-4">
                  <Input
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                    placeholder="Enter restaurant ID"
                    className="max-w-xs"
                  />
                  <Button 
                    onClick={handleFetchOrders} 
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                    Fetch Orders
                  </Button>
                </div>
              </div>
              
              {orders.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Orders ({orders.length})</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order._id} className={selectedOrder?._id === order._id ? "bg-blue-50" : ""}>
                            <td className="px-4 py-2 text-sm font-mono text-gray-500">{order._id}</td>
                            <td className="px-4 py-2 text-sm">{order.orderNumber}</td>
                            <td className="px-4 py-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm">${order.totalAmount.toFixed(2)}</td>
                            <td className="px-4 py-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleOrderSelect(order)}
                              >
                                Select
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Update Order Tab */}
        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Order ID:</label>
                <Input
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter order ID"
                  className="max-w-xs"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">New Status:</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleUpdateOrderStatus} 
                disabled={loading || !orderId}
                className="flex items-center gap-2"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                Update Status
              </Button>
              
              {selectedOrder && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Selected Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs space-y-1">
                      <p><strong>ID:</strong> {selectedOrder._id}</p>
                      <p><strong>Order #:</strong> {selectedOrder.orderNumber}</p>
                      <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                      <p><strong>Customer:</strong> {selectedOrder.customerId}</p>
                      <p><strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Custom Request Tab */}
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom API Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium block mb-1">API Base URL:</label>
                  <Input 
                    value={apiUrl} 
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://localhost:8082"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Method:</label>
                  <Select value={customMethod} onValueChange={setCustomMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Endpoint:</label>
                <Input 
                  value={customEndpoint} 
                  onChange={(e) => setCustomEndpoint(e.target.value)} 
                  placeholder="/api/v1/order/restaurant/1"
                />
              </div>
              
              {(customMethod === 'POST' || customMethod === 'PUT' || customMethod === 'PATCH') && (
                <div>
                  <label className="text-sm font-medium block mb-1">Request Body (JSON):</label>
                  <Textarea 
                    value={requestBody} 
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="font-mono"
                    rows={5}
                  />
                </div>
              )}
              
              <Button 
                onClick={handleCustomRequest} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                Send Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* API Response Display */}
      {(apiResponse || error) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              API Response
              {statusCode !== null && (
                <span className={`ml-2 text-sm px-2 py-1 rounded ${
                  statusCode >= 200 && statusCode < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {statusCode}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div className="text-red-700">{error}</div>
              </div>
            ) : apiResponse ? (
              <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-[400px] text-sm font-mono">
                {apiResponse}
              </pre>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
