"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Order, OrderStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { customerService } from '@/services/customer-service';
import { format } from 'date-fns';
import { 
  ArrowLeft, Star, Phone, MapPin, Calendar, Clock, CheckCircle,
  ShoppingBag, Utensils, Truck, Package, Home
} from 'lucide-react';

interface OrderDetailsViewProps {
  order: Order;
}

export default function OrderDetailsView({ order }: OrderDetailsViewProps) {
  const [rating, setRating] = useState({ restaurant: 0, driver: 0 });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Format times
  const orderDate = format(new Date(order.createdAt), 'MMM d, yyyy');
  const orderTime = format(new Date(order.createdAt), 'h:mm a');

  // Check if order is active or completed
  const isActiveOrder = ['placed', 'accepted', 'preparing', 'ready', 'pickedUp'].includes(order.status);
  const isDelivered = order.status === 'delivered';

  const handleSubmitRating = async () => {
    setIsSubmitting(true);
    try {
      await customerService.rateOrder(
        order.id,
        rating.restaurant,
        rating.driver,
        comment
      );
      
      toast({
        title: 'Thank you!',
        description: 'Your rating has been submitted',
      });
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your rating',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0"
        onClick={() => router.push('/customer/orders')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-lg">{order.restaurantName}</h2>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{orderDate}</span>
                  <span className="mx-2">•</span>
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{orderTime}</span>
                </div>
              </div>
              <div>
                <Badge 
                  variant="outline" 
                  className={getStatusBadgeColor(order.status)}
                >
                  {getStatusText(order.status)}
                </Badge>
              </div>
            </div>
            
            {/* Timeline */}
            <div className="relative">
              {renderTimeline(order)}
            </div>
            
            {/* Driver Info (only show if order has been picked up) */}
            {(order.status === 'pickedUp' || order.status === 'delivered') && order.driverName && (
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Delivery Driver</h3>
                <div className="flex items-center">
                  <div className="mr-4">
                    {/* Generic driver icon as placeholder */}
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Truck className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{order.driverName}</p>
                    {order.driverPhone && (
                      <a 
                        href={`tel:${order.driverPhone}`} 
                        className="text-sm text-blue-600 flex items-center mt-1"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        {order.driverPhone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center">
                  {item.image && (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Delivery Address */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Delivery Address</h4>
                  <p className="text-gray-600">{order.address}</p>
                </div>
              </div>
            </div>
            
            {/* Payment Summary */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Rate Order (only show for delivered orders) */}
        {isDelivered && (
          <Card>
            <CardHeader>
              <CardTitle>Rate Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Restaurant Rating */}
                <div>
                  <h3 className="font-medium mb-2">Rate {order.restaurantName}</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        onClick={() => setRating({ ...rating, restaurant: star })}
                        className={star <= rating.restaurant ? "text-yellow-400" : "text-gray-300"}
                      >
                        <Star className="h-6 w-6" fill={star <= rating.restaurant ? "currentColor" : "none"} />
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Driver Rating (only if there was a driver) */}
                {order.driverName && (
                  <div>
                    <h3 className="font-medium mb-2">Rate Delivery by {order.driverName}</h3>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          onClick={() => setRating({ ...rating, driver: star })}
                          className={star <= rating.driver ? "text-yellow-400" : "text-gray-300"}
                        >
                          <Star className="h-6 w-6" fill={star <= rating.driver ? "currentColor" : "none"} />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Comment */}
                <div>
                  <h3 className="font-medium mb-2">Additional Comments (Optional)</h3>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                
                <Button
                  className="w-full bg-[#7ED957] hover:bg-[#6bc548]"
                  onClick={handleSubmitRating}
                  disabled={isSubmitting || (rating.restaurant === 0 && rating.driver === 0)}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Reorder Button */}
        {!isActiveOrder && (
          <Button
            className="mt-2 bg-[#7ED957] hover:bg-[#6bc548]"
            onClick={() => router.push(`/customer/restaurant/${order.restaurantId}`)}
          >
            Order Again from {order.restaurantName}
          </Button>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getStatusBadgeColor(status: OrderStatus) {
  switch (status) {
    case 'placed': return 'bg-blue-100 text-blue-800';
    case 'accepted': return 'bg-purple-100 text-purple-800';
    case 'preparing': return 'bg-yellow-100 text-yellow-800';
    case 'ready': return 'bg-orange-100 text-orange-800';
    case 'pickedUp': return 'bg-indigo-100 text-indigo-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status: OrderStatus) {
  switch (status) {
    case 'placed': return 'Order Placed';
    case 'accepted': return 'Accepted';
    case 'preparing': return 'Preparing';
    case 'ready': return 'Ready for Pickup';
    case 'pickedUp': return 'Out for Delivery';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
}

function getTimelineIcon(status: OrderStatus) {
  switch (status) {
    case 'placed': return <ShoppingBag className="h-6 w-6" />;
    case 'accepted': return <CheckCircle className="h-6 w-6" />;
    case 'preparing': return <Utensils className="h-6 w-6" />;
    case 'ready': return <Package className="h-6 w-6" />;
    case 'pickedUp': return <Truck className="h-6 w-6" />;
    case 'delivered': return <Home className="h-6 w-6" />;
    default: return <Clock className="h-6 w-6" />;
  }
}

function getTimelineTitle(status: OrderStatus) {
  switch (status) {
    case 'placed': return 'Order Placed';
    case 'accepted': return 'Restaurant Accepted';
    case 'preparing': return 'Preparing Your Food';
    case 'ready': return 'Ready for Pickup';
    case 'pickedUp': return 'Out for Delivery';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
}

function renderTimeline(order: Order) {
  // Define the possible statuses in order
  const statuses: OrderStatus[] = ['placed', 'accepted', 'preparing', 'ready', 'pickedUp', 'delivered'];
  
  // Find the current status index
  const currentStatusIndex = statuses.indexOf(order.status);
  
  // Get the timestamps for each status
  const statusTimes = order.timeline.reduce((acc, item) => {
    acc[item.status] = format(new Date(item.time), 'h:mm a');
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6">
      {statuses.map((status, index) => {
        const isCompleted = index <= currentStatusIndex;
        const isCurrent = index === currentStatusIndex;
        
        return (
          <div key={status} className="flex">
            <div className="relative mr-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isCompleted 
                  ? 'bg-[#7ED957] text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {getTimelineIcon(status)}
              </div>
              {/* Connecting line */}
              {index < statuses.length - 1 && (
                <div className={`absolute top-10 left-5 w-0.5 h-10 -ml-px ${
                  index < currentStatusIndex ? 'bg-[#7ED957]' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
            <div className="flex-1 pt-1.5 pb-8">
              <h3 className="text-lg font-medium">{getTimelineTitle(status)}</h3>
              {statusTimes[status] ? (
                <p className="text-sm text-gray-500">{statusTimes[status]}</p>
              ) : (
                <p className="text-sm text-gray-400">Pending</p>
              )}
              {isCurrent && status !== 'delivered' && status !== 'cancelled' && (
                <p className="text-sm text-[#7ED957] font-medium mt-1">Current Status</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}