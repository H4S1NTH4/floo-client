"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Settings, History, CreditCard } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">John Doe</h1>
                <p className="text-gray-500">john.doe@example.com</p>
                <Button variant="outline" className="mt-2">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Settings className="h-6 w-6 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Account Settings</h3>
                  <p className="text-sm text-gray-500">Manage your preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <History className="h-6 w-6 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Order History</h3>
                  <p className="text-sm text-gray-500">View past orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/customer/payments">
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CreditCard className="h-6 w-6 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Payment Methods</h3>
                  <p className="text-sm text-gray-500">Manage payment options</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </Link>
        </div>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-500">Phone Number</h4>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500">Default Address</h4>
              <p>123 Main Street, Apt 4B</p>
              <p>New York, NY 10001</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500">Member Since</h4>
              <p>January 2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}