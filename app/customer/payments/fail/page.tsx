'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <XCircle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-6">We encountered an issue with your payment. Please try again.</p>
      <Button className="bg-red-500 hover:bg-red-600" onClick={() => router.push('/customer/cart')}>Go Back to Cart</Button>
    </div>
  );
}