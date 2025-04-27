'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign } from 'lucide-react';

export default function AvailableOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Available Orders</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Example order cards - in production, these would be populated from your backend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Order #1234
              <span className="text-sm font-normal text-green-600">$15.50</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>2.5 miles away</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Estimated 20 mins</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>$4.50 delivery fee</span>
              </div>
              <Button className="w-full mt-4">Accept Order</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Order #1235
              <span className="text-sm font-normal text-green-600">$22.75</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>1.8 miles away</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Estimated 15 mins</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>$5.00 delivery fee</span>
              </div>
              <Button className="w-full mt-4">Accept Order</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}