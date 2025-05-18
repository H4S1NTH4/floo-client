// app/restaurant/starter-dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { restaurantService } from "@/services/restaurant-service";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
    Home,
    Utensils,
    Package,
    Clock,
    Settings,
    ChefHat,
    Users,
    TrendingUp,
    DollarSign,
    Star,
    PieChart,
    Calendar,
    ShoppingBag,
    Bell,
    BarChart3,
    ChevronRight
} from "lucide-react";

export default function RestaurantStarterDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        // Set current date
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        };
        setCurrentDate(today.toLocaleDateString('en-US', options));
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="space-y-4 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[#7ED957] border-opacity-50 border-t-[#7ED957] rounded-full mx-auto"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Starter dashboard data
    const dashboardData = {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        popularity: 0,
        ordersToday: 0,
        revenueToday: 0,
        weeklyRevenue: [
            { day: 'Mon', amount: 0 },
            { day: 'Tue', amount: 0 },
            { day: 'Wed', amount: 0 },
            { day: 'Thu', amount: 0 },
            { day: 'Fri', amount: 0 },
            { day: 'Sat', amount: 0 },
            { day: 'Sun', amount: 0 }
        ],
        newCustomers: 0,
        repeatCustomers: 0,
        popularItems: [],
        recentOrders: []
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Welcome to Your New Restaurant</h1>
                    <p className="text-gray-500">Let's get started! Here's how to set up your restaurant.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {currentDate}
                    </Button>
                </div>
            </div>

            {/* Getting Started Guide */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Getting Started</CardTitle>
                    <CardDescription>Follow these steps to launch your restaurant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-[#F0FBF0] text-[#7ED957] rounded-full p-2">
                            <ChefHat className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium">1. Set Up Your Menu</h3>
                            <p className="text-sm text-gray-500">Add your menu items to start accepting orders</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-[#F0FBF0] text-[#7ED957] rounded-full p-2">
                            <Settings className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium">2. Configure Restaurant Settings</h3>
                            <p className="text-sm text-gray-500">Set your hours, delivery options, and more</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-[#F0FBF0] text-[#7ED957] rounded-full p-2">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium">3. Invite Your Staff</h3>
                            <p className="text-sm text-gray-500">Add team members to help manage orders</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Empty State Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-[#e7f8e8] to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Today's Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-gray-500 mt-1">No orders yet</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Today's Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-gray-500 mt-1">No orders yet</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-gray-500 mt-1">No pending orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Customer Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="text-2xl font-bold mr-2">0.0</div>
                            <div className="flex text-gray-300">
                                <Star className="h-4 w-4" />
                                <Star className="h-4 w-4" />
                                <Star className="h-4 w-4" />
                                <Star className="h-4 w-4" />
                                <Star className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">No ratings yet</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Link href="/restaurant/menu">
                        <Button className="w-full flex items-center justify-between" variant="outline">
                            <div className="flex items-center">
                                <Utensils className="h-4 w-4 mr-2" />
                                Set Up Your Menu
                            </div>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href="/restaurant/settings">
                        <Button className="w-full flex items-center justify-between" variant="outline">
                            <div className="flex items-center">
                                <Settings className="h-4 w-4 mr-2" />
                                Configure Settings
                            </div>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Button className="w-full flex items-center justify-between" variant="outline">
                        <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Invite Staff Members
                        </div>
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button className="w-full flex items-center justify-between mt-2" variant="default"
                            style={{ backgroundColor: '#7ED957', color: '#fff' }}>
                        <div className="flex items-center">
                            <ChefHat className="h-4 w-4 mr-2" />
                            Add Your First Menu Item
                        </div>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}