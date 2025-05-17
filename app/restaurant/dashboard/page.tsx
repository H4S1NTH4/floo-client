// app/restaurant/dashboard/page.tsx
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

export default function RestaurantDashboardPage() {
    const [dashboardData, setDashboardData] = useState<{
        totalOrders: number;
        totalRevenue: number;
        pendingOrders: number;
        popularity: number;
        ordersToday: number;
        revenueToday: number;
        weeklyRevenue: { day: string; amount: number }[];
        newCustomers: number;
        repeatCustomers: number;
        popularItems: Array<{ name: string; count: number; revenue: number }>;
        recentOrders: Array<{ id: string; items: number; total: number; status: string; time: string }>;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState("");    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await restaurantService.getRestaurantDashboard("1"); // Burger Palace
                setDashboardData(data);
                
                // Set current date in format "May 17, 2025"
                const today = new Date();
                const options: Intl.DateTimeFormatOptions = { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                };
                setCurrentDate(today.toLocaleDateString('en-US', options));
                
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Burger Palace Dashboard</h1>
                    <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your restaurant today.</p>
                </div>                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {currentDate || "May 17, 2025"}
                    </Button>
                    <Button size="sm" className="relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    </Button>
                </div>
            </div>

            {/* Business Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-[#e7f8e8] to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Today&apos;s Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${dashboardData?.revenueToday.toFixed(2)}</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +12.5% from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Today&apos;s Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData?.ordersToday}</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +8.2% from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                        <div>
                            <div className="text-2xl font-bold">{dashboardData?.pendingOrders}</div>
                            <p className="text-xs text-amber-600 flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" /> Need attention
                            </p>
                        </div>
                        <Link href="/restaurant/orders">
                            <Button size="sm" variant="outline">View</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Customer Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="text-2xl font-bold mr-2">{dashboardData?.popularity}</div>
                            <div className="flex text-amber-400">
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" style={{ clipPath: 'inset(0 20% 0 0)' }} />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +0.2 this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Chart Card - Takes 2/3 of the width on large screens */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between">
                            <div>
                                <CardTitle>Revenue Overview</CardTitle>
                                <CardDescription>Weekly revenue breakdown</CardDescription>
                            </div>
                            <Tabs defaultValue="weekly">
                                <TabsList className="grid grid-cols-3 h-8">
                                    <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                                    <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                                    <TabsTrigger value="yearly" className="text-xs">Yearly</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px] flex items-end justify-between">
                            {dashboardData?.weeklyRevenue.map((day, i) => (
                                <div key={day.day} className="flex flex-col items-center gap-2 w-1/7">
                                    <div 
                                        className="bg-[#7ED957] rounded-t-sm w-12"
                                        style={{ 
                                            height: `${(day.amount / Math.max(...dashboardData.weeklyRevenue.map(d => d.amount))) * 200}px`,
                                            opacity: day.day === 'Sat' ? 1 : 0.7
                                        }}
                                    ></div>
                                    <div className="text-xs font-medium">{day.day}</div>
                                    <div className="text-xs text-gray-500">${day.amount}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Items Card - Takes 1/3 of the width */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <CardTitle>Best Sellers</CardTitle>
                            <Button variant="link" size="sm" className="text-[#7ED957] p-0">
                                See all <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {dashboardData?.popularItems.slice(0, 4).map((item, index) => (
                                <div key={item.name} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-[#F0FBF0] text-[#7ED957] rounded-full flex items-center justify-center mr-3">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.count} orders</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">${item.revenue.toFixed(0)}</div>
                                        <div className="text-xs text-gray-500">Revenue</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Recent Orders</CardTitle>
                            <Link href="/restaurant/orders">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {dashboardData?.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-white p-2 rounded-lg">
                                            <ShoppingBag className="h-6 w-6 text-[#7ED957]" />
                                        </div>
                                        <div>
                                            <div className="font-medium">Order #{order.id}</div>
                                            <div className="text-xs text-gray-500">{order.items} items • {order.time}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <div className="font-medium">${order.total.toFixed(2)}</div>
                                        </div>
                                        <Badge className={
                                            order.status === 'ready' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                            order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                            'bg-green-100 text-green-800 hover:bg-green-100'
                                        }>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

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
                                    Manage Menu
                                </div>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        
                        <Link href="/restaurant/orders">
                            <Button className="w-full flex items-center justify-between" variant="outline">
                                <div className="flex items-center">
                                    <Package className="h-4 w-4 mr-2" />
                                    Process Orders
                                </div>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        
                        <Button className="w-full flex items-center justify-between" variant="outline">
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                Manage Staff
                            </div>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        
                        <Button className="w-full flex items-center justify-between" variant="outline">
                            <div className="flex items-center">
                                <Settings className="h-4 w-4 mr-2" />
                                Restaurant Settings
                            </div>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        
                        <Button className="w-full flex items-center justify-between mt-2" variant="default" 
                            style={{ backgroundColor: '#7ED957', color: '#fff' }}>
                            <div className="flex items-center">
                                <ChefHat className="h-4 w-4 mr-2" />
                                Add New Menu Item
                            </div>
                            <ChevronRight className="h-4 w-4" />                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}