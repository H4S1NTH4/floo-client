"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { customerService } from '@/services/customer-service';
import { Restaurant, Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Clock, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomerHomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [nearbyRestaurants, favoriteRestaurants, restaurantCategories] = await Promise.all([
          customerService.getNearbyRestaurants(),
          customerService.getFavoriteRestaurants('1'), // Using mock customer ID
          customerService.getCategories()
        ]);
        
        setRestaurants(nearbyRestaurants);
        setFavorites(favoriteRestaurants);
        setCategories(restaurantCategories);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/customer/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-8">
        <Card className="bg-[#7ED957]/10 border-none">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-2">Hey, what&apos;s for lunch?</h1>
            <p className="text-gray-600 mb-4">Order food from your favorite restaurants</p>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  type="text" 
                  placeholder="Search for restaurants or cuisines" 
                  className="pl-10 bg-white border-gray-200" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-[#7ED957] hover:bg-[#6bc548]">Search</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link href={`/customer/search?category=${category.name}`} key={category.id}>
                <div className="group cursor-pointer">
                  <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">{category.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <Tabs defaultValue="nearby">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Restaurants</h2>
            <TabsList>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="nearby">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You don&apos;t have any favorite restaurants yet.</p>
                <Button 
                  onClick={() => router.push('/customer/search')}
                  className="bg-[#7ED957] hover:bg-[#6bc548]"
                >
                  Explore Restaurants
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/customer/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            style={{ objectFit: 'cover' }}
          />
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Closed</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{restaurant.name}</h3>
            <div className="flex items-center bg-[#7ED957]/10 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-[#7ED957] mr-1" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.categories.map((category, idx) => (
              <span key={idx} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                {category}
              </span>
            ))}
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{restaurant.address}</span>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function RestaurantCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>

        <div className="flex gap-1 mb-3">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>

        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardContent>
    </Card>
  );
}