// app/restaurant/orders/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRestaurantOrders } from "@/hooks/use-restaurant-orders";
import { Order } from "@/types/order";
import { Clock, CheckCircle, XCircle, Utensils, Truck, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

// Define the order status icons mapping
const statusIcons = {
    "PENDING": <Clock className="h-4 w-4" />,
    "ACCEPTED": <CheckCircle className="h-4 w-4 text-blue-500" />,
    "PREPARING": <Utensils className="h-4 w-4 text-yellow-500" />,
    "READY": <CheckCircle className="h-4 w-4 text-orange-500" />,
    "PICKED_UP": <Truck className="h-4 w-4 text-indigo-500" />,
    "DELIVERING": <Truck className="h-4 w-4 text-purple-500" />,
    "DELIVERED": <CheckCircle className="h-4 w-4 text-green-500" />,
    "COMPLETED": <CheckCircle className="h-4 w-4 text-green-500" />,
    "CANCELLED": <XCircle className="h-4 w-4 text-red-500" />,
    "DENIED": <XCircle className="h-4 w-4 text-red-500" />,
};

// Define the possible actions for each status
const statusActions = {
    "PENDING": ["ACCEPTED", "DENIED"],
    "ACCEPTED": ["PREPARING", "CANCELLED"],
    "PREPARING": ["READY", "CANCELLED"],
    "READY": ["PICKED_UP", "CANCELLED"],
    "PICKED_UP": ["DELIVERING", "CANCELLED"],
    "DELIVERING": ["DELIVERED", "CANCELLED"],
    "DELIVERED": ["COMPLETED"],
};

// Helper component for displaying orders in a table
const OrdersTable = ({ 
    orders,
    handleStatusChange,
    showActions = true,
    isUpdating = false
}: { 
    orders: Order[], 
    handleStatusChange: (orderId: string, status: string) => Promise<void>,
    showActions?: boolean,
    isUpdating?: boolean
}) => {
    if (orders.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                {isUpdating ? (
                    <div className="flex flex-col items-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                        <p className="mt-2">Refreshing orders...</p>
                    </div>
                ) : (
                    "No orders found"
                )}
            </div>
        );
    }

    return (
        <div className={`${isUpdating ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-200`}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        {showActions && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => {                        // Get the correct ID - API returns 'id' but we need to handle both formats
                        const orderId = order.id || order._id || '';
                        
                        // Skip rendering this order if it has no ID
                        if (!orderId) {
                            console.error('Order missing ID:', order);
                            return null;
                        }
                        
                        return (
                            <TableRow key={orderId}>
                                <TableCell className="font-medium">
                                    #{order.orderNumber}
                                </TableCell>
                                <TableCell>
                                    {order.customerId}
                                </TableCell>
                                <TableCell>
                                    {order.orderItems.map((item) => 
                                        `${item.quantity}x ${item.name}`
                                    ).join(", ")}
                                </TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    {statusIcons[order.orderStatus as keyof typeof statusIcons]}
                                    <span className="capitalize">{order.orderStatus.toLowerCase().replace('_', ' ')}</span>
                                </TableCell>
                                {showActions && (
                                    <TableCell>
                                        <div className="flex gap-2 flex-wrap">
                                            <Link href={`/restaurant/orders/${orderId}`}>
                                                <Button variant="outline" size="sm">
                                                    Details
                                                </Button>
                                            </Link>
                                            {statusActions[order.orderStatus as keyof typeof statusActions]?.map((action) => (
                                                <Button
                                                    key={action}
                                                    variant={
                                                        action === "CANCELLED" || action === "DENIED" 
                                                            ? "destructive" 
                                                            : "default"
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        handleStatusChange(orderId, action)
                                                    }
                                                >
                                                    {action === "ACCEPTED" && "Accept"}
                                                    {action === "PREPARING" && "Prepare"}
                                                    {action === "READY" && "Ready"}
                                                    {action === "PICKED_UP" && "Picked Up"}
                                                    {action === "DELIVERING" && "Delivering"}
                                                    {action === "DELIVERED" && "Delivered"}
                                                    {action === "COMPLETED" && "Complete"}
                                                    {action === "CANCELLED" && "Cancel"}
                                                    {action === "DENIED" && "Deny"}
                                                </Button>
                                            ))}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default function RestaurantOrdersPage() {
    // Hard-coded restaurant ID for now as requested
    const restaurantId = "1";
    
    // Use our custom hook for fetching and polling orders
    const {
        activeOrders,
        completedOrders,
        cancelledOrders,
        loading,
        isUpdating,
        error,
        lastUpdated,
        refreshOrders,
        updateOrderStatus
    } = useRestaurantOrders({
        restaurantId,
        pollingInterval: 15000 // Poll every 15 seconds
    });
    
    // Track manual refresh state
    const [refreshing, setRefreshing] = useState(false);

    // Handle manual refresh
    const handleManualRefresh = async () => {
        setRefreshing(true);
        await refreshOrders();
        setTimeout(() => setRefreshing(false), 1000); // Show spinner for at least 1 second
    };

    // Handle status change
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const result = await updateOrderStatus(orderId, newStatus);
            
            if (result) {
                toast({
                    title: "Order Updated",
                    description: `Order status changed to ${newStatus}`,
                    variant: "default",
                });
            } else {
                toast({
                    title: "Update Failed",
                    description: "Could not update order status. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error("Error updating order:", err);
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "An error occurred",
                variant: "destructive",
            });
        }
    };

    // Display loading state
    if (loading) {
        return <div className="p-8 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
                <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
        </div>;
    }

    // Display error state if there's an issue
    if (error) {
        return <div className="p-8 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <p className="mt-2 text-red-600">{error}</p>
                <Button onClick={handleManualRefresh} className="mt-4" variant="outline">
                    Try Again
                </Button>
            </div>
        </div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Order Management</h1>
                    {lastUpdated && (
                        <p className="text-sm text-gray-500">
                            Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                        </p>
                    )}
                </div>
                <Button 
                    onClick={handleManualRefresh} 
                    variant="outline"
                    disabled={refreshing || isUpdating}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${refreshing || isUpdating ? 'animate-spin' : ''}`} />
                    {refreshing || isUpdating ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="active" className="relative">
                        Active Orders
                        {activeOrders.length > 0 && (
                            <Badge className="ml-2 bg-blue-500">{activeOrders.length}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        Completed Orders
                        {completedOrders.length > 0 && (
                            <Badge className="ml-2 bg-green-500">{completedOrders.length}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="cancelled">
                        Cancelled Orders
                        {cancelledOrders.length > 0 && (
                            <Badge className="ml-2 bg-red-500">{cancelledOrders.length}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Active orders tab */}
                <TabsContent value="active">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable 
                                orders={activeOrders} 
                                handleStatusChange={handleStatusChange}
                                showActions={true}
                                isUpdating={isUpdating}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Completed orders tab */}
                <TabsContent value="completed">
                    <Card>
                        <CardHeader>
                            <CardTitle>Completed Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable 
                                orders={completedOrders}
                                handleStatusChange={handleStatusChange}
                                showActions={false}
                                isUpdating={isUpdating}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Cancelled orders tab */}
                <TabsContent value="cancelled">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cancelled Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable 
                                orders={cancelledOrders}
                                handleStatusChange={handleStatusChange}
                                showActions={false}
                                isUpdating={isUpdating}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
