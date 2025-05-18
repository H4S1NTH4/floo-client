"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { restaurantService } from "@/services/restaurant-service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

type MenuItemForm = {
    name: string;
    description: string;
    price: number;
    category: string;
};

export default function AddFirstMenuItemPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<MenuItemForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: MenuItemForm) => {
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Add the menu item
            await restaurantService.addMenuItem("1", {
                ...data,
                price: Number(data.price),
                image: "https://via.placeholder.com/150",
                popular: false
            });

            // Show success message
            toast({
                title: "Success!",
                description: "Your first menu item has been added.",
                variant: "default",
            });

            // Redirect to the main menu page
            router.push("/restaurant/menu");
        } catch (error) {
            console.error("Failed to add menu item:", error);
            toast({
                title: "Error",
                description: "Failed to add menu item. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Add Your First Menu Item</h1>
                <Link href="/restaurant/starter-dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Let's Create Your First Menu Item</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Item Name*</Label>
                            <Input
                                id="name"
                                {...register("name", { required: "Name is required" })}
                                placeholder="Classic Burger"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="description">Description*</Label>
                            <Textarea
                                id="description"
                                {...register("description", {
                                    required: "Description is required",
                                })}
                                placeholder="Tell customers about this item"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="price">Price*</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                {...register("price", {
                                    required: "Price is required",
                                    min: { value: 0, message: "Price must be positive" },
                                })}
                                placeholder="9.99"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="category">Category*</Label>
                            <Input
                                id="category"
                                {...register("category", { required: "Category is required" })}
                                placeholder="Burgers"
                            />
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category.message}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-[#7ED957] hover:bg-[#6bc548]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add Menu Item"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-6 text-center text-sm text-gray-500">
                <p>This will be the first item in your restaurant's menu. You can add more later.</p>
            </div>
        </div>
    );
}