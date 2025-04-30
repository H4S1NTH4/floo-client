// app/restaurant/layout.tsx
"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RestaurantLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user?.role !== "restaurant") {
            router.push("/");
        }
    }, [user, router]);

    return <div className="min-h-screen bg-[#F7FDF9]">{children}</div>;
}