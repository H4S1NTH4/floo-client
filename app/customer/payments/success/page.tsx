'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreateOrderRequest } from '@/types/order';
import { createOrder } from '@/lib/api/orderService';
import { useCart } from '@/components/providers/cart-provider';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const [isCreatingOrder, setIsCreatingOrder] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderCreationAttempted, setOrderCreationAttempted] = useState(false);
    useEffect(() => {
    // Don't do anything if we've already attempted to create an order in this component instance
    if (orderCreationAttempted) {
      return;
    }
    
    // Check session storage as a fallback for page refreshes
    const hasAttempted = sessionStorage.getItem('orderCreationAttempted');
    
    if (hasAttempted === 'true') {
      setIsCreatingOrder(false);
      return;
    }
    
    async function processOrder() {
      // Mark that we've attempted order creation in this component instance
      setOrderCreationAttempted(true);
      sessionStorage.setItem('orderCreationAttempted', 'true');
      
      try {
        
        // Get checkout data from localStorage
        const checkoutDataStr = localStorage.getItem('pendingCheckout');
        if (!checkoutDataStr) {
          toast({
            title: 'Error',
            description: 'No checkout data found. Please try again.',
            variant: 'destructive',
          });
          router.push('/customer/cart');
          return;
        }
        
        const checkoutData = JSON.parse(checkoutDataStr);
        
        // Log the checkout data for troubleshooting (can be removed in production)
        console.log("Processing checkout data:", checkoutData);
          // Create an order using the stored checkout data - formatted to match the expected server format
        const orderData: CreateOrderRequest = {
          orderNumber: Math.floor(Math.random() * 9000) + 1000, // Generate a random 4-digit order number
          customerId: checkoutData.customerId || 'cust' + Math.floor(Math.random() * 9000 + 1000),
          userId: checkoutData.customerId || 'user001', // Using consistent format with server expectation
          restaurantId: checkoutData.restaurantId,
          restaurantName: checkoutData.restaurantName,
          orderItems: checkoutData.items.map((item: any) => ({
            id: item.id,
            foodItemId: item.id, // Adding foodItemId for server compatibility
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
            imageUrl: item.image || '' // Adding imageUrl for server compatibility
          })),
          subTotal: checkoutData.subtotal,
          deliveryFee: checkoutData.deliveryFee,
          totalAmount: checkoutData.total,
          orderTime: checkoutData.timestamp,
          deliveryTime: Date.now() + 30 * 60 * 1000, // Estimated delivery time (30 mins from now)
          deliveryAddress: checkoutData.deliveryAddress,
          restaurantAddress: checkoutData.restaurantAddress || '',
          orderStatus: 'PENDING',
          paymentId: checkoutData.paymentId || 'stripe_payment'
        };
          // Call the API to create the order
        console.log("Sending order data to API:", JSON.stringify(orderData));
        
        let order;
        try {
          order = await createOrder(orderData);
          console.log("Order creation response:", order);
          
          if (!order) {
            throw new Error('No response received from server');
          }
            if (!order.orderNumber) {
            console.warn("Missing order number in response:", order);
            // Try to use a fallback ID if possible
            const fallbackId = orderData.orderNumber.toString();
            setOrderId(fallbackId);
          } else {
            // Set the order number for display - prefer using order number over _id
            setOrderId(order.orderNumber.toString());
          }} catch (apiError: any) {
          console.error("API error details:", apiError);
          throw new Error(`Failed to create order: ${apiError?.message || 'Unknown error'}`);
          
          // Alternative approach using typescript narrowing
          // if (apiError instanceof Error) {
          //   throw new Error(`Failed to create order: ${apiError.message}`);
          // } else {
          //   throw new Error(`Failed to create order: Unknown error`);
          // }
        }
        
        // Clear the pending checkout data
        localStorage.removeItem('pendingCheckout');
          // Clear the cart since the order is now placed
        clearCart();
        
        // Success message
        toast({
          title: 'Order created!',
          description: 'Your order has been successfully placed.',
        });
        
        // We can reset the session storage for future orders when a user navigates away
        // This won't affect the current component instance due to our state checks
      } catch (error) {
        console.error('Failed to create order:', error);
        toast({
          title: 'Error',
          description: 'Failed to create your order. Please contact support.',
          variant: 'destructive',
        });
      } finally {
        setIsCreatingOrder(false);
      }
    }
    
    processOrder();    
    // Cleanup: Remove the attempt flag when component unmounts
    return () => {
      // We only remove orderCreationAttempted from session storage
      // when the component unmounts completely, not when the effect re-runs
      // This helps prevent multiple API calls during component lifecycle
      // but allows new orders on new page visits
      sessionStorage.removeItem('orderCreationAttempted');
    };
  }, [router, toast, clearCart, orderCreationAttempted]);

  const viewOrders = () => {
    // If we have an order ID, go to the specific order page, otherwise go to the orders list
    if (orderId) {
      router.push(`/customer/orders/${orderId}`);
    } else {
      router.push('/customer/orders');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      
      {isCreatingOrder ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-2" />
          <p className="text-gray-600">Creating your order...</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-2">Thank you for your payment. Your order has been placed successfully.</p>
          {orderId && (
            <p className="text-gray-700 font-medium mb-4">Order ID: #{orderId}</p>
          )}
          <Button className="bg-green-500 hover:bg-green-600" onClick={viewOrders}>
            View Orders
          </Button>
        </>
      )}
    </div>
  );
}
