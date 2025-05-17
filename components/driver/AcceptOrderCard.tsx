'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Order } from '@/types/order';

interface AcceptOrderCardProps {
  order: Order;
  onAccept: () => void;
  onDecline: () => void;
}

export default function AcceptOrderCard({ order, onAccept, onDecline }: AcceptOrderCardProps) {
  return (
    <div style={{ width: '100%' }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Order #{order.orderNumber}
            <span className="text-sm font-normal text-green-600">${order.totalAmount.toFixed(2)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{order.deliveryAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Estimated {new Date(order.deliveryTime).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>${order.deliveryFee.toFixed(2)} delivery fee</span>
            </div>
            <Button className="w-full mt-4" onClick={onAccept}>Accept Order</Button>
            <Button 
              className="w-full mt-4 bg-gray-200 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200" 
              onClick={onDecline}
            >
              Decline Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}