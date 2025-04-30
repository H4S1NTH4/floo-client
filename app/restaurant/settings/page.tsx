// app/restaurant/settings/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { restaurantService } from "@/services/restaurant-service";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RestaurantSettingsPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchRestaurantStatus = async () => {
            try {
                const restaurant = await restaurantService.getRestaurantById("1");
                if (restaurant) {
                    setIsOpen(restaurant.isOpen);
                }
            } catch (error) {
                console.error("Failed to fetch restaurant status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantStatus();
    }, []);

    const handleToggleStatus = async () => {
        try {
            await restaurantService.updateRestaurantStatus("1", !isOpen);
            setIsOpen(!isOpen);
            toast({
                title: "Status updated",
                description: `Your restaurant is now ${!isOpen ? "open" : "closed"}`,
            });
        } catch (error) {
            console.error("Failed to update restaurant status:", error);
            toast({
                title: "Error",
                description: "Failed to update restaurant status",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div className="p-8">Loading settings...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Restaurant Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Restaurant Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">
                                {isOpen ? "Open for Orders" : "Currently Closed"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {isOpen
                                    ? "Customers can place orders from your menu"
                                    : "Customers cannot place orders"}
                            </p>
                        </div>
                        <Button
                            onClick={handleToggleStatus}
                            variant={isOpen ? "destructive" : "default"}
                            className={isOpen ? "" : "bg-[#7ED957] hover:bg-[#6bc548]"}
                        >
                            {isOpen ? "Close Restaurant" : "Open Restaurant"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}