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
import { Home, Utensils, Package, Clock, Settings, ChefHat, Users, TrendingUp, DollarSign, Star, PieChart, Calendar, ShoppingBag, Bell, BarChart3, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export default function RestaurantStarterDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState("");
    const [restaurantData, setRestaurantData] = useState<any>(null);
    const { user } = useAuth();

    useEffect(() => {
        // Set current date
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        };
        setCurrentDate(today.toLocaleDateString('en-US', options));

        // Fetch restaurant data (simulated)
        const fetchData = async () => {
            try {
                // Simulate loading from localStorage (where we'll store registration data)
                const data = localStorage.getItem('restaurantRegistrationData');
                if (data) {
                    setRestaurantData(JSON.parse(data));
                }
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
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
                    <h1 className="text-3xl font-bold">
                        Welcome to {restaurantData?.name || "Your New Restaurant"}
                    </h1>
                    <p className="text-gray-500">
                        {restaurantData ? "Let's get your restaurant ready for customers!" : "Let's get started! Here's how to set up your restaurant."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {currentDate}
                    </Button>
                </div>
            </div>

            {/* Show restaurant details if registered */}
            {restaurantData && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Your Restaurant Details</CardTitle>
                        <CardDescription>These are the details you provided during registration</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium">Restaurant Name</h3>
                            <p className="text-sm text-gray-500">{restaurantData.name}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Cuisine Type</h3>
                            <p className="text-sm text-gray-500">{restaurantData.cuisineType}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Address</h3>
                            <p className="text-sm text-gray-500">{restaurantData.address}, {restaurantData.city}, {restaurantData.state} {restaurantData.zipcode}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Phone Number</h3>
                            <p className="text-sm text-gray-500">{restaurantData.phone}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

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

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Link href="/restaurant/menu/add-first-item">
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

                    <Link href="/restaurant/menu/add-first-item">
                        <Button className="w-full flex items-center justify-between mt-2" variant="default"
                                style={{ backgroundColor: '#7ED957', color: '#fff' }}>
                            <div className="flex items-center">
                                <ChefHat className="h-4 w-4 mr-2" />
                                Add Your First Menu Item
                            </div>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}