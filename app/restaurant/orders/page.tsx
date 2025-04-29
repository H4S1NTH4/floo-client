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
import { restaurantService } from "@/services/restaurant-service";
import { Order, OrderStatus } from "@/types";
import { Clock, CheckCircle, XCircle, Utensils, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
//export type OrderStatus = "placed" | "accepted" | "preparing" | "ready" | "pickedUp" | "delivered" | "cancelled";

const statusIcons: Partial<Record<OrderStatus, JSX.Element>> = {
    placed: <Clock className="h-4 w-4" />,
    accepted: <CheckCircle className="h-4 w-4 text-blue-500" />,
    preparing: <Utensils className="h-4 w-4 text-yellow-500" />,
    ready: <CheckCircle className="h-4 w-4 text-orange-500" />,
    pickedUp: <Truck className="h-4 w-4 text-indigo-500" />,
    delivered: <CheckCircle className="h-4 w-4 text-green-500" />,
    cancelled: <XCircle className="h-4 w-4 text-red-500" />,
};

const statusActions: Partial<Record<OrderStatus, OrderStatus[]>> = {
    placed: ["accepted", "cancelled"],
    accepted: ["preparing", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["pickedUp", "cancelled"],
    pickedUp: ["delivered"],
};

export default function RestaurantOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const [pending, active] = await Promise.all([
                    restaurantService.getPendingOrders("1"),
                    restaurantService.getActiveOrders("1"),
                ]);
                setOrders([...pending, ...active]);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        try {
            await restaurantService.updateOrderStatus("1", orderId, status);
            setOrders(
                orders.map((order) =>
                    order.id === orderId ? { ...order, status } : order
                )
            );
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

    if (loading) {
        return <div className="p-8">Loading orders...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Management</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        #{order.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        {order.items
                                            .map((item) => `${item.quantity}x ${item.name}`)
                                            .join(", ")}
                                    </TableCell>
                                    <TableCell>${order.total.toFixed(2)}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {statusIcons[order.status as keyof typeof statusIcons]}
                                        <span className="capitalize">{order.status}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={`/restaurant/orders/${order.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Details
                                                </Button>
                                            </Link>
                                            {statusActions[order.status]?.map((action) => (
                                                <Button
                                                    key={action}
                                                    variant={
                                                        action === "cancelled" ? "destructive" : "default"
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        handleStatusChange(order.id, action as OrderStatus)
                                                    }
                                                >
                                                    {action === "accepted" && "Accept"}
                                                    {action === "preparing" && "Start Preparing"}
                                                    {action === "ready" && "Mark as Ready"}
                                                    {action === "pickedUp" && "Mark as Picked Up"}
                                                    {action === "delivered" && "Mark as Delivered"}
                                                    {action === "cancelled" && "Cancel"}
                                                </Button>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}