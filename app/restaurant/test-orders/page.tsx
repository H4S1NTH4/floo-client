"use client";

import { useEffect, useState } from "react";
import { useRestaurantOrders } from "@/hooks/use-restaurant-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateOrderStatus } from "@/lib/api/orderService";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Info } from "lucide-react";

// Debug component to display API errors
const DebugInfo = ({ error, visible }: { error: string | null, visible: boolean }) => {
  if (!visible || !error) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md my-4">
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 text-amber-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-amber-800">Debug Information</h3>
          <pre className="text-xs bg-white p-2 mt-2 rounded overflow-auto max-h-48">
            {error}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default function TestOrderStatus() {
  const restaurantId = "1"; // Use restaurant ID 1 as required
  const { 
    activeOrders, 
    completedOrders, 
    cancelledOrders,
    loading, 
    error,
    refreshOrders
  } = useRestaurantOrders({ 
    restaurantId,
    pollingInterval: 5000 // Poll every 5 seconds for testing
  });

  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  // Handle order status update
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setStatusUpdateLoading(true);
      console.log(`Updating order with ID: ${orderId} to status: ${newStatus}`);
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "Status updated",
        description: `Order status changed to ${newStatus}`,
        variant: "default",
      });
      // Refresh orders to get the latest data
      refreshOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Order Status Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Active Orders Section */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle>Active Orders ({activeOrders.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {activeOrders.length === 0 ? (
              <p>No active orders</p>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order._id || order.orderNumber} className="border p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Order #{order.orderNumber}</span>
                      <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Customer: {order.customerId}</p>
                    <p className="text-sm mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">                      {order.orderStatus === "PENDING" && (
                        <>
                          <Button size="sm" onClick={() => handleStatusChange(order._id!, "ACCEPTED")}>
                            Accept
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleStatusChange(order._id!, "DENIED")}>
                            Deny
                          </Button>
                        </>
                      )}
                      {order.orderStatus === "ACCEPTED" && (
                        <Button size="sm" onClick={() => handleStatusChange(order._id!, "PREPARING")}>
                          Start Preparing
                        </Button>
                      )}
                      {order.orderStatus === "PREPARING" && (
                        <Button size="sm" onClick={() => handleStatusChange(order._id!, "READY")}>
                          Mark Ready
                        </Button>
                      )}
                      {["ACCEPTED", "PREPARING", "READY"].includes(order.orderStatus) && (
                        <Button size="sm" variant="destructive" onClick={() => handleStatusChange(order._id!, "CANCELLED")}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Orders Section */}
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle>Completed Orders ({completedOrders.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {completedOrders.length === 0 ? (
              <p>No completed orders</p>
            ) : (
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <div key={order._id || order.orderNumber} className="border p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Order #{order.orderNumber}</span>
                      <span className="text-sm bg-green-100 px-2 py-1 rounded">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Customer: {order.customerId}</p>
                    <p className="text-sm mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cancelled Orders Section */}
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle>Cancelled Orders ({cancelledOrders.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {cancelledOrders.length === 0 ? (
              <p>No cancelled orders</p>
            ) : (
              <div className="space-y-4">
                {cancelledOrders.map((order) => (
                  <div key={order._id || order.orderNumber} className="border p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Order #{order.orderNumber}</span>
                      <span className="text-sm bg-red-100 px-2 py-1 rounded">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Customer: {order.customerId}</p>
                    <p className="text-sm mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button 
          onClick={() => refreshOrders()} 
          className="flex items-center gap-2"
        >
          Manual Refresh
        </Button>
      </div>

      {/* Debug Information Display */}
      <DebugInfo error={error} visible={!!error} />
    </div>
  );
}
