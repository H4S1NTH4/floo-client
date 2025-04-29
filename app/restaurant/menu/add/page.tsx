// app/restaurant/menu/add/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { restaurantService } from "@/services/restaurant-service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type MenuItemForm = {
    name: string;
    description: string;
    price: number;
    category: string;
    popular: boolean;
};

export default function AddMenuItemPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<MenuItemForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: MenuItemForm) => {
        setIsSubmitting(true);
        try {
            await restaurantService.addMenuItem("1", {
                ...data,
                price: Number(data.price),
                image: "https://via.placeholder.com/150", // Default image
            });
            router.push("/restaurant/menu");
        } catch (error) {
            console.error("Failed to add menu item:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Add Menu Item</h1>
                <Link href="/restaurant/menu">
                    <Button variant="outline">Back to Menu</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Item Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Item Name</Label>
                            <Input
                                id="name"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...register("description", {
                                    required: "Description is required",
                                })}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                {...register("price", {
                                    required: "Price is required",
                                    min: { value: 0, message: "Price must be positive" },
                                })}
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                {...register("category", { required: "Category is required" })}
                            />
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category.message}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="popular"
                                {...register("popular")}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="popular">Mark as popular item</Label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/restaurant/menu")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#7ED957] hover:bg-[#6bc548]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add Item"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}