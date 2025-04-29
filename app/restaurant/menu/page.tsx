// app/restaurant/menu/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { restaurantService } from "@/services/restaurant-service";
import { MenuItem } from "@/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RestaurantMenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const items = await restaurantService.getRestaurantMenu("1"); // Mock restaurant ID
                setMenuItems(items);
            } catch (error) {
                console.error("Failed to fetch menu items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    const handleDelete = async (itemId: string) => {
        try {
            await restaurantService.deleteMenuItem("1", itemId);
            setMenuItems(menuItems.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error("Failed to delete menu item:", error);
        }
    };

    if (loading) {
        return <div className="p-8">Loading menu...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Menu Management</h1>
                <Link href="/restaurant/menu/add">
                    <Button className="bg-[#7ED957] hover:bg-[#6bc548]">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Popular</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {menuItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                    <TableCell>{item.popular ? "Yes" : "No"}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Link href={`/restaurant/menu/edit/${item.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}