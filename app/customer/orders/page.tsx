"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchOrdersByCustomerId } from '@/lib/api/orderService';
import { Order } from '@/types/order';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, ClipboardCheck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OrdersPage() {
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Get all orders for customer with ID = 1
        const orders = await fetchOrdersByCustomerId('1');

        if (Array.isArray(orders)) {
          // Filter out CANCELLED orders from both lists
          const filteredOrders = orders.filter(order => order.orderStatus !== 'CANCELLED');
          
          // Current orders are all orders that are not COMPLETED or CANCELLED
          const current = filteredOrders.filter(order => order.orderStatus !== 'COMPLETED');
          
          // Past orders only include COMPLETED orders
          const past = filteredOrders.filter(order => order.orderStatus === 'COMPLETED');
          
          setCurrentOrders(current);
          setPastOrders(past);
        } else {
          console.error('Unexpected response format from API');
          toast({
            title: 'Error',
            description: 'Failed to fetch your orders. Please try again.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch your orders. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <Tabs defaultValue="current">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="current" className="flex-1">Current Orders</TabsTrigger>
          <TabsTrigger value="past" className="flex-1">Order History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          {loading ? (
            <div className="space-y-4">
              {Array(2).fill(0).map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>          ) : currentOrders.length > 0 ? (
            <div className="space-y-4">
              {currentOrders.map((order) => (
                <OrderCard key={order._id || order.orderNumber} order={order} isActive={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No current orders</h2>
              <p className="text-gray-500 mb-6">You don&apos;t have any ongoing orders at the moment.</p>
              <Link href="/customer/home">
                <Button className="bg-[#7ED957] hover:bg-[#6bc548]">Order Food</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>          ) : pastOrders.length > 0 ? (
            <div className="space-y-4">
              {pastOrders.map((order) => (
                <OrderCard key={order._id || order.orderNumber} order={order} isActive={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No order history</h2>
              <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
              <Link href="/customer/home">
                <Button className="bg-[#7ED957] hover:bg-[#6bc548]">Order Food</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderCard({ order, isActive }: { order: Order; isActive: boolean }) {
  // Format the order date
  const orderDate = formatDistanceToNow(new Date(order.orderTime), { addSuffix: true });
  
  // Get status badge color
  const getStatusColor = () => {
    switch (order.orderStatus) {
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED': return 'bg-purple-100 text-purple-800';
      case 'PREPARING': return 'bg-yellow-100 text-yellow-800';
      case 'READY': return 'bg-orange-100 text-orange-800';
      case 'PICKED_UP': return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERING': return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status display text
  const getStatusText = () => {
    switch (order.orderStatus) {
      case 'PENDING': return 'Order Placed';
      case 'ACCEPTED': return 'Accepted';
      case 'PREPARING': return 'Preparing';
      case 'READY': return 'Ready for Pickup';
      case 'PICKED_UP': return 'Out for Pickup';
      case 'DELIVERING': return 'Out for Delivery';
      case 'DELIVERED': return 'Delivered';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return order.orderStatus;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{order.restaurantName}</h3>
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>          <div className="flex justify-between text-sm text-gray-500">
            <span>Order #{order.orderNumber}</span>
            <span>{orderDate}</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {(item.imageUrl || item.image) && (
                  <div className="relative h-8 w-8 rounded-md overflow-hidden">
                    <Image
                      src={item.imageUrl || item.image || ''}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <span className="text-sm">
                  {item.quantity}x {item.name}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-2">
                {order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
              </span>
            </div>
            
            <Link href={`/customer/orders/${order._id || order.orderNumber}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                {isActive ? 'Track Order' : 'View Details'}
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
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
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-32" />
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