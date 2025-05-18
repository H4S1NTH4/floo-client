"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type RestaurantForm = {
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    phone: string;
    cuisineType: string;
};

export default function RestaurantRegistrationPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<RestaurantForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: RestaurantForm) => {
        setIsSubmitting(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Store registration data in localStorage
            localStorage.setItem('restaurantRegistrationData', JSON.stringify(data));

            // For demo purposes, we'll just log and redirect
            console.log("Restaurant registration data:", data);
            router.push("/restaurant/starter-dashboard");
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Complete Your Restaurant Profile</h1>
                <p className="text-gray-600">
                    Please provide your restaurant details to get started
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Restaurant Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Restaurant Name*</Label>
                            <Input
                                id="name"
                                {...register("name", { required: "Restaurant name is required" })}
                                placeholder="Burger Palace"
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
                                placeholder="Tell customers about your restaurant"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="cuisineType">Cuisine Type*</Label>
                            <Input
                                id="cuisineType"
                                {...register("cuisineType", { required: "Cuisine type is required" })}
                                placeholder="American, Italian, etc."
                            />
                            {errors.cuisineType && (
                                <p className="text-sm text-red-500">{errors.cuisineType.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="address">Street Address*</Label>
                                <Input
                                    id="address"
                                    {...register("address", { required: "Address is required" })}
                                    placeholder="123 Main St"
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-500">{errors.address.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="city">City*</Label>
                                <Input
                                    id="city"
                                    {...register("city", { required: "City is required" })}
                                    placeholder="New York"
                                />
                                {errors.city && (
                                    <p className="text-sm text-red-500">{errors.city.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="state">State*</Label>
                                <Input
                                    id="state"
                                    {...register("state", { required: "State is required" })}
                                    placeholder="NY"
                                />
                                {errors.state && (
                                    <p className="text-sm text-red-500">{errors.state.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="zipcode">ZIP Code*</Label>
                                <Input
                                    id="zipcode"
                                    {...register("zipcode", { required: "ZIP code is required" })}
                                    placeholder="10001"
                                />
                                {errors.zipcode && (
                                    <p className="text-sm text-red-500">{errors.zipcode.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone Number*</Label>
                            <Input
                                id="phone"
                                {...register("phone", { required: "Phone number is required" })}
                                placeholder="(555) 123-4567"
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-[#7ED957] hover:bg-[#6bc548]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Registering..." : "Complete Registration"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}