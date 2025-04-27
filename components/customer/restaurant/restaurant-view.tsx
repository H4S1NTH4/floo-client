"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Restaurant, MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/components/providers/cart-provider';
import { useToast } from '@/hooks/use-toast';
import { Clock, MapPin, Star, Info, Heart, Plus } from 'lucide-react';

interface RestaurantViewProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
}

export default function RestaurantView({ restaurant, menuItems }: RestaurantViewProps) {
  const [menuCategories] = useState<string[]>(
    Array.from(new Set(menuItems.map(item => item.category)))
  );
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      restaurantId: restaurant.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-8">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 mb-4 -mx-4">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-[#7ED957] mr-1" />
              <span>{restaurant.rating}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center">
              <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{restaurant.address}</span>
          </div>
        </div>
        <Button 
          size="icon" 
          variant="outline" 
          className="absolute top-4 right-4 bg-white/80 hover:bg-white"
        >
          <Heart className="h-5 w-5 text-red-500" />
        </Button>
      </div>

      {/* Menu */}
      <div className="px-4">
        {!restaurant.isOpen && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-yellow-500 mr-2" />
              <p className="font-medium text-yellow-700">This restaurant is currently closed. You can still browse the menu.</p>
            </div>
          </div>
        )}

        {/* Categories Tabs */}
        <Tabs defaultValue={menuCategories[0] || "all"} className="mb-8">
          <div className="border-b">
            <TabsList className="w-full justify-start">
              {menuCategories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="px-4 py-2"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {menuCategories.map((category) => (
            <TabsContent key={category} value={category} className="pt-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold">{category}</h2>
                <p className="text-gray-500">
                  {menuItems.filter(item => item.category === category).length} items
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems
                  .filter(item => item.category === category)
                  .map((item) => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      onAddToCart={handleAddToCart}
                      restaurantOpen={restaurant.isOpen}
                    />
                  ))
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  restaurantOpen: boolean;
}

function MenuItemCard({ item, onAddToCart, restaurantOpen }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden h-full hover:shadow-sm transition-shadow duration-300">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative h-32 md:h-auto md:w-1/3">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          {item.popular && (
            <div className="absolute top-2 left-2">
              <span className="text-xs bg-[#7ED957] text-white px-2 py-1 rounded-full">
                Popular
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-grow md:w-2/3">
          <h3 className="font-bold mb-1">{item.name}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2 flex-grow">
            {item.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="font-medium">${item.price.toFixed(2)}</span>
            <Button 
              size="sm" 
              onClick={() => onAddToCart(item)}
              disabled={!restaurantOpen}
              className="bg-[#7ED957] hover:bg-[#6bc548]"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}