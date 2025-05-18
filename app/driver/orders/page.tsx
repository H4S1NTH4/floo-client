"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchOrdersByStatus } from '@/lib/api/orderService';
import { Order } from '@/types/order';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, ClipboardCheck, Clock, Navigation, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function DriverOrdersPage() {
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Hard-coded driver ID - in a real app, this would come from authentication
  const driverId = "6826199186c67747e579e3db";

  useEffect(() => {
    const fetchDriverOrders = async () => {
      setLoading(true);
      try {
        // Fetch orders with status PICKED_UP or DELIVERING for the current driver
        // In a real app, you would filter by driverId
        const [pickedUpOrders, deliveringOrders, deliveredOrders] = await Promise.all([
          fetchOrdersByStatus('PICKED_UP'),
          fetchOrdersByStatus('DELIVERING'),
          fetchOrdersByStatus('DELIVERED')
        ]);
        
        // Combine current active orders
        const active = [...(Array.isArray(pickedUpOrders) ? pickedUpOrders : []), 
                       ...(Array.isArray(deliveringOrders) ? deliveringOrders : [])];
        
        // For completed orders
        const completed = Array.isArray(deliveredOrders) ? deliveredOrders : [];
        
        setCurrentOrders(active);
        setCompletedOrders(completed);
      } catch (error) {
        console.error('Failed to fetch driver orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch delivery orders. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDriverOrders();
    // Set up an interval to refresh orders every minute
    const interval = setInterval(fetchDriverOrders, 60000);
    return () => clearInterval(interval);
  }, [toast]);

  // Navigate to delivery screen
  const handleNavigateToDelivery = (orderNumber: number) => {
    router.push(`/driver/navi?order=${orderNumber}`);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6">My Delivery Orders</h1>
      
      <Tabs defaultValue="active">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="active" className="flex-1">Active Deliveries</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">Completed Deliveries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {loading ? (
            <div className="space-y-4">
              {Array(2).fill(0).map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          ) : currentOrders.length > 0 ? (
            <div className="space-y-4">
              {currentOrders.map((order) => (
                <DriverOrderCard 
                  key={order._id || order.orderNumber} 
                  order={order} 
                  isActive={true}
                  onNavigate={() => handleNavigateToDelivery(order.orderNumber)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Navigation className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No active deliveries</h2>
              <p className="text-gray-500 mb-6">You don&apos;t have any ongoing deliveries at the moment.</p>
              <Link href="/driver/home">
                <Button className="bg-[#7ED957] hover:bg-[#6bc548]">Find Deliveries</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {loading ? (
            <div className="space-y-4">
              {Array(2).fill(0).map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          ) : completedOrders.length > 0 ? (
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <DriverOrderCard 
                  key={order._id || order.orderNumber} 
                  order={order} 
                  isActive={false}
                  onNavigate={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No completed deliveries</h2>
              <p className="text-gray-500 mb-6">You haven&apos;t completed any deliveries yet.</p>
              <Link href="/driver/home">
                <Button className="bg-[#7ED957] hover:bg-[#6bc548]">Find Deliveries</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DriverOrderCard({ 
  order, 
  isActive, 
  onNavigate 
}: { 
  order: Order; 
  isActive: boolean;
  onNavigate: () => void;
}) {
  // Format the order date
  const orderDate = formatDistanceToNow(new Date(order.orderTime), { addSuffix: true });
  const router = useRouter();

  
  // Get status badge color
  const getStatusColor = () => {
    switch (order.orderStatus) {
      case 'PICKED_UP': return 'bg-blue-100 text-blue-800';
      case 'DELIVERING': return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status display text
  const getStatusText = () => {
    switch (order.orderStatus) {
      case 'PICKED_UP': return 'Picked Up';
      case 'DELIVERING': return 'On The Way';
      case 'DELIVERED': return 'Delivered';
      default: return order.orderStatus;
    }
  };

  const handleOrderPage =() =>{
    router.push('/driver/orders');
  }
  const handleHomePage =() =>{
    router.push('/driver/home');
  }

  return (
    <div>
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{order.restaurantName || "Restaurant"}</h3>
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Order #{order.orderNumber}</span>
            <span>{orderDate}</span>
          </div>
        </div>
        
        <div className="p-4">
          {/* Pickup and Delivery Addresses */}
          <div className="mb-4">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center mt-1">
                <span className="text-xs">P</span>
              </div>
              <div>
                <p className="text-sm font-medium">Pickup</p>
                <p className="text-xs text-gray-500">{order.restaurantAddress || "Restaurant address"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center mt-1">
                <span className="text-xs">D</span>
              </div>
              <div>
                <p className="text-sm font-medium">Delivery</p>
                <p className="text-xs text-gray-500">{order.deliveryAddress || "Customer address"}</p>
              </div>
            </div>
          </div>
          
          {/* Order Items Count */}
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-2">
                {order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
              </span>
            </div>
            
            {isActive ? (
              <Button 
                onClick={onNavigate}
                className="bg-[#7ED957] hover:bg-[#6bc548] text-white flex items-center gap-1"
                size="sm"
              >
                Navigate
                <Navigation className="h-3 w-3 ml-1" />
              </Button>
            ) : (
              <Link href={`/driver/orders/${order.orderNumber}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  View Details
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    <footer className="fixed bottom-0 w-full bg-white border-t shadow-inner flex justify-around items-center p-4">
        <button className="text-gray-600 hover:text-black" onClick={handleHomePage}> 🏠Home</button>
        <button className="text-gray-600 hover:text-black">🗺️ Map</button>
        <button className="text-gray-600 hover:text-black" onClick={handleOrderPage}>📦 Orders</button>
      </footer>
    </div>
  );
}

function OrderCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-2 mb-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
