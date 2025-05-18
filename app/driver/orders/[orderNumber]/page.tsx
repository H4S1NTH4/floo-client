"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchOrderByNumber } from '@/lib/api/orderService';
import { Order } from '@/types/order';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Navigation, Package, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params?.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderNumber) return;
      
      setLoading(true);
      try {
        const orderData = await fetchOrderByNumber(orderNumber);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load order details. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderNumber, toast]);

  const handleNavigate = () => {
    if (order) {
      router.push(`/driver/navi?order=${order.orderNumber}`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Button variant="outline" onClick={handleGoBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-gray-500">We couldn&apos;t find the order you&apos;re looking for.</p>
        </div>
      </div>
    );
  }

  // Format dates
  const orderDate = format(new Date(order.orderTime), 'PPP');
  const orderTime = format(new Date(order.orderTime), 'p');
  const deliveryDate = order.deliveryTime ? format(new Date(order.deliveryTime), 'PPP') : '';
  const deliveryTime = order.deliveryTime ? format(new Date(order.deliveryTime), 'p') : '';

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

  const isActiveDelivery = ['PICKED_UP', 'DELIVERING'].includes(order.orderStatus);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <Button variant="outline" onClick={handleGoBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
        <Badge variant="outline" className={getStatusColor()}>
          {getStatusText()}
        </Badge>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{order.restaurantName || 'Restaurant'}</h2>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm text-gray-600">{orderDate} at {orderTime}</span>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mt-1">
                <MapPin className="h-3 w-3" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Pickup Location</h3>
                <p className="text-sm text-gray-600">{order.restaurantAddress || 'Restaurant address'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mt-1">
                <MapPin className="h-3 w-3" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Delivery Location</h3>
                <p className="text-sm text-gray-600">{order.deliveryAddress || 'Customer address'}</p>
                
                {order.deliveryTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    Delivered on {deliveryDate} at {deliveryTime}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {isActiveDelivery && (
            <Button 
              className="w-full bg-[#7ED957] hover:bg-[#6bc548] text-white"
              onClick={handleNavigate}
            >
              Navigate to Delivery
              <Navigation className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
      
      <h2 className="text-lg font-semibold mb-4">Order Items</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="p-4 flex items-center">
                {(item.imageUrl || item.image) && (
                  <div className="relative h-12 w-12 rounded-md overflow-hidden mr-3">
                    <Image
                      src={item.imageUrl || item.image || ''}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Subtotal</span>
              <span>${order.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <Skeleton className="h-10 w-24" />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-40 mt-1" />
              </div>
            </div>
          </div>
          
          <Skeleton className="h-10 w-full rounded" />
        </CardContent>
      </Card>
      
      <Skeleton className="h-6 w-32 mb-4" />
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 flex items-center">
                <Skeleton className="h-12 w-12 rounded-md mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between mb-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between mb-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
