// app/restaurant/menu/edit/[id]/page.tsx
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type MenuItemForm = {
    name: string;
    description: string;
    price: number;
    category: string;
    popular: boolean;
};

export default function EditMenuItemPage({
                                             params,
                                         }: {
    params: { id: string };
}) {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<MenuItemForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const menuItems = await restaurantService.getRestaurantMenu("1");
                const item = menuItems.find((item) => item.id === params.id);
                if (item) {
                    reset({
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        category: item.category,
                        popular: item.popular || false,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch menu item:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItem();
    }, [params.id, reset]);

    const onSubmit = async (data: MenuItemForm) => {
        setIsSubmitting(true);
        try {
            await restaurantService.updateMenuItem("1", params.id, {
                ...data,
                price: Number(data.price),
            });
            router.push("/restaurant/menu");
        } catch (error) {
            console.error("Failed to update menu item:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading menu item...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Menu Item</h1>
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
                                {isSubmitting ? "Updating..." : "Update Item"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}