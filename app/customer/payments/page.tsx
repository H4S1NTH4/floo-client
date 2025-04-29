"use client";

import React, { useEffect, useState } from 'react';
import { paymentService } from '@/services/payment-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      const userPayments = await paymentService.getUserPayments('1'); // Mock user ID
      setPayments(userPayments);
    };
    fetchPayments();
  }, []);

  const handlePayment = async () => {
    if (!amount) {
      toast({ title: 'Error', description: 'Enter a valid amount', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      const payment = await paymentService.processPayment('1', parseFloat(amount));
      setPayments(prev => [payment, ...prev]);
      toast({ title: 'Payment Status', description: `Payment ${payment.status}`, variant: payment.status === 'success' ? 'default' : 'destructive' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Make a Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mt-8 mb-4">Payment History</h2>
      {payments.map(payment => (
        <Card key={payment.id} className="mb-4">
          <CardContent>
            <div className="flex justify-between">
              <span>${payment.amount.toFixed(2)}</span>
              <span>{payment.status}</span>
            </div>
            <div className="text-sm text-gray-500">{new Date(payment.date).toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
