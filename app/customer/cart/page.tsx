"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/components/providers/cart-provider';
import { useToast } from '@/hooks/use-toast';
import { customerService } from '@/services/customer-service';
import { MapPin, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, subtotal, restaurantId, updateQuantity, removeItem, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  // const handleCheckout = async () => {
  //   if (!deliveryAddress) {
  //     toast({
  //       title: 'Address required',
  //       description: 'Please enter a delivery address',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   // Prepare cart details for the API request
  //   const cartDetails = items.map(item => ({
  //     name: item.name,
  //     amount: item.price,
  //     quantity: item.quantity,
  //     currency: 'USD', // Hardcoded currency
  //   }));

  //   // Log cart details to the console
  //   console.log('Cart Details:', cartDetails);

  //   try {
  //     // Send cart details to the payment API
  //     const response = await fetch('http://localhost:8081/api/v1/payment/strip/checkout', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(cartDetails),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to initiate payment');
  //     }

  //     const paymentResult = await response.json();
  //     console.log('Payment API Response:', paymentResult);

  //     setIsLoading(true);
  //     const order = await customerService.placeOrder(
  //       '1', // Mock customer ID
  //       restaurantId!,
  //       items.map(item => ({ id: item.id, quantity: item.quantity })),
  //       deliveryAddress
  //     );
      
  //     // Clear cart after successful order
  //     clearCart();
      
  //     toast({
  //       title: 'Order placed successfully!',
  //       description: 'You will be redirected to track your order',
  //     });
      
  //     // Redirect to order tracking page
  //     router.push(`/customer/orders/${order.id}`);
  //   } catch (error) {
  //     console.error('Failed to place order or initiate payment:', error);
  //     toast({
  //       title: 'Failed to place order',
  //       description: 'An error occurred while placing your order. Please try again.',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const calculateDeliveryFee = async () => {
    if (!deliveryAddress) return;
    
    try {
      const fee = await customerService.calculateDeliveryFee(deliveryAddress);
      setDeliveryFee(fee);
    } catch (error) {
      console.error('Failed to calculate delivery fee:', error);
    }
  };

  // Calculate total with delivery fee
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!deliveryAddress) {
      toast({
        title: 'Address required',
        description: 'Please enter a delivery address',
        variant: 'destructive',
      });
      return;
    }
  
    const cartItem = items[0]; // Take the first item for now
  
    const paymentPayload = {
      name: cartItem.name,
      amount: cartItem.price,
      quantity: cartItem.quantity,
      currency: 'USD', // or 'USD' if you are using USD
    };
  
    try {
      setIsLoading(true);
  
      const response = await fetch('http://localhost:8081/api/v1/payment/strip/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }
  
      const paymentResult = await response.json();
      console.log('Payment API Response:', paymentResult);
  
      if (paymentResult.status === 'SUCCESS' && paymentResult.sessionUrl) {
        window.location.href = paymentResult.sessionUrl;
      } else {
        throw new Error(paymentResult.message || 'Payment session not created');
      }
  
    } catch (error) {
      console.error('Failed to initiate payment session:', error);
      toast({
        title: 'Failed to initiate payment',
        description: 'An error occurred while initiating payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  

 
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add items from restaurants to get started</p>
        <Button 
          onClick={() => router.push('/customer/home')}
          className="bg-[#7ED957] hover:bg-[#6bc548]"
        >
          Browse Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="justify-end">
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="text-gray-500"
              >
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Enter your delivery address" 
                    className="pl-10"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    onBlur={calculateDeliveryFee}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#7ED957] hover:bg-[#6bc548]"
                onClick={handleCheckout}
                disabled={isLoading || !deliveryAddress}
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}