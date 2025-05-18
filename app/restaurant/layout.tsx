// app/restaurant/layout.tsx
"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
    Home, 
    Menu, 
    Package, 
    Users, 
    DollarSign, 
    Settings, 
    LogOut, 
    Bell,
    Search,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function RestaurantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (user?.role !== "restaurant") {
            router.push("/");
        }
    }, [user, router]);

    // Check if current route is registration page
    const isRegistrationPage = pathname === "/restaurant/register";

    if (isRegistrationPage) {
        return (
            <div className="min-h-screen bg-[#F7FDF9]">
                {/* Simple header for registration page */}
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-[#7ED957] rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold">BP</span>
                                </div>
                                <span className="font-bold">Floo</span>
                            </div>
                        </div>
                    </div>
                </header>
                {children}
            </div>
        );
    }
    // Navigation links for the sidebar
    const navLinks = [
        { name: "Dashboard", href: "/restaurant/dashboard", icon: <Home className="w-5 h-5" /> },
        { name: "Menu Management", href: "/restaurant/menu", icon: <Menu className="w-5 h-5" /> },
        { name: "Orders", href: "/restaurant/orders", icon: <Package className="w-5 h-5" />, notifications: 1 },
        { name: "Customers", href: "/restaurant/customers", icon: <Users className="w-5 h-5" /> },
        { name: "Finances", href: "/restaurant/finances", icon: <DollarSign className="w-5 h-5" /> },
        { name: "Settings", href: "/restaurant/settings", icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-[#F7FDF9]">
            {/* Sidebar */}
            <div className={`bg-white border-r border-gray-200 ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
                {/* Logo */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200 p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#7ED957] rounded-md flex items-center justify-center">
                            <span className="text-white font-bold">BP</span>
                        </div>
                        {sidebarOpen && (
                            <span className="font-bold text-lg">Burger Palace</span>
                        )}
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    isActive 
                                    ? 'bg-[#F0FBF0] text-[#7ED957]' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {link.icon}
                                {sidebarOpen && (
                                    <div className="ml-4 flex-1 flex justify-between items-center">
                                        <span>{link.name}</span>
                                        {link.notifications && (
                                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                                {link.notifications}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                {sidebarOpen ? (
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="/manager-avatar.png" alt="Manager" />
                                <AvatarFallback>BP</AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                                <p className="text-sm font-medium">John Smith</p>
                                <p className="text-xs text-gray-500">Restaurant Manager</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-t border-gray-200 flex justify-center">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/manager-avatar.png" alt="Manager" />
                            <AvatarFallback>BP</AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input 
                                placeholder="Search..." 
                                className="pl-10 bg-gray-50 border-none focus-visible:ring-gray-200" 
                            />
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </Button>
                            
                            <div className="flex items-center">
                                <Button variant="ghost" size="sm" className="font-normal flex items-center text-gray-600">
                                    Today: May 16, 2025
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}