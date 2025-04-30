// app/restaurant/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { restaurantService } from "@/services/restaurant-service";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Utensils, Package, Clock, Settings } from "lucide-react";

export default function RestaurantDashboardPage() {
    const [dashboardData, setDashboardData] = useState<{
        totalOrders: number;
        totalRevenue: number;
        pendingOrders: number;
        popularItems: Array<{ name: string; count: number }>;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await restaurantService.getRestaurantDashboard("1"); // Mock restaurant ID
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Restaurant Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardData?.totalOrders}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Home className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${dashboardData?.totalRevenue.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <Clock className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardData?.pendingOrders}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Link href="/restaurant/menu">
                    <Button className="w-full flex items-center gap-2">
                        <Utensils className="h-4 w-4" />
                        Manage Menu
                    </Button>
                </Link>

                <Link href="/restaurant/orders">
                    <Button className="w-full flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        View Orders
                    </Button>
                </Link>

                <Button className="w-full flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Restaurant Settings
                </Button>
            </div>

            {dashboardData?.popularItems && (
                <Card>
                    <CardHeader>
                        <CardTitle>Popular Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dashboardData.popularItems.map((item) => (
                                <div key={item.name} className="flex justify-between">
                                    <span>{item.name}</span>
                                    <span className="font-medium">{item.count} orders</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}