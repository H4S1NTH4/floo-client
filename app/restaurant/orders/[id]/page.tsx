// app/restaurant/orders/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { restaurantService } from "@/services/restaurant-service";
import { format } from "date-fns";
import { ArrowLeft, Clock, CheckCircle, XCircle, Utensils, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetailsPage({
                                             params,
                                         }: {
    params: { id: string };
}) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // In a real app, we'd have a getOrderById method in the service
                const allOrders = await restaurantService.getActiveOrders("1");
                const foundOrder = allOrders.find((o) => o.id === params.id);
                if (foundOrder) {
                    setOrder(foundOrder);
                } else {
                    router.push("/restaurant/orders");
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [params.id, router]);

    if (loading) {
        return <div className="p-8">Loading order...</div>;
    }

    if (!order) {
        return <div className="p-8">Order not found</div>;
    }

    const orderDate = format(new Date(order.createdAt), "MMM d, yyyy");
    const orderTime = format(new Date(order.createdAt), "h:mm a");

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    className="mr-4"
                    onClick={() => router.push("/restaurant/orders")}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                </Button>
                <h1 className="text-2xl font-bold">Order Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                            <p className="text-sm text-gray-500">
                                Placed on {orderDate} at {orderTime}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Customer</h4>
                            <p>Customer ID: {order.customerId}</p>
                            <p>Delivery Address: {order.address}</p>
                        </div>

                        {order.driverName && (
                            <div>
                                <h4 className="font-medium mb-2">Driver</h4>
                                <p>Name: {order.driverName}</p>
                                {order.driverPhone && <p>Phone: {order.driverPhone}</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between">
                                    <div>
                                        <p className="font-medium">
                                            {item.quantity}x {item.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            ${item.price.toFixed(2)} each
                                        </p>
                                    </div>
                                    <p className="font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span>${order.deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Order Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.timeline.map((event: any) => (
                                <div key={`${event.status}-${event.time}`} className="flex items-start gap-4">
                                    <div className="mt-1">
                                        {event.status === "placed" && <Clock className="h-5 w-5 text-gray-500" />}
                                        {event.status === "accepted" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                                        {event.status === "preparing" && <Utensils className="h-5 w-5 text-yellow-500" />}
                                        {event.status === "ready" && <CheckCircle className="h-5 w-5 text-orange-500" />}
                                        {event.status === "pickedUp" && <Truck className="h-5 w-5 text-indigo-500" />}
                                        {event.status === "delivered" && <CheckCircle className="h-5 w-5 text-green-500" />}
                                        {event.status === "cancelled" && <XCircle className="h-5 w-5 text-red-500" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium capitalize">{event.status}</h4>
                                        <p className="text-sm text-gray-500">
                                            {format(new Date(event.time), "MMM d, yyyy 'at' h:mm a")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}