"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AppFeatures } from '@/components/landing/app-features';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Footer } from '@/components/landing/footer';
import { Utensils, ShoppingBag, Car, ShieldCheck } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full py-4 px-4 md:px-8 flex items-center justify-between border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-[#7ED957]" />
          <span className="font-bold text-2xl">Floo</span>
        </div>
        <div className="flex gap-2 md:gap-4">
          <Link href="/auth/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-[#7ED957] hover:bg-[#6bc548] text-white">Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Food delivery, <br/>made <span className="text-[#7ED957]">simple</span>.
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Order from your favorite restaurants and track your delivery in real time with Floo.
              </p>
              <div className="space-x-4 pt-4">
                <Link href="/customer/home">
                  <Button size="lg" className="bg-[#7ED957] hover:bg-[#6bc548] text-white">
                    Order Now
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline">
                    Join as a Driver
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Food delivery" 
                fill 
                style={{ objectFit: 'cover' }}
                className="rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* User Types Section */}
        <section className="py-16 bg-white px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Something for everyone
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <UserTypeCard 
                icon={<ShoppingBag className="h-12 w-12 text-[#7ED957]" />}
                title="Customers"
                description="Order your favorite meals from local restaurants and have them delivered to your door."
                link="/customer/home"
                linkText="Order Food"
              />
              <UserTypeCard 
                icon={<Utensils className="h-12 w-12 text-[#7ED957]" />}
                title="Restaurants"
                description="Partner with us to reach more customers and grow your business."
                link="/auth/signup?role=restaurant"
                linkText="Partner with Us"
              />
              <UserTypeCard 
                icon={<Car className="h-12 w-12 text-[#7ED957]" />}
                title="Drivers"
                description="Earn money on your schedule by delivering food to hungry customers."
                link="/auth/signup?role=driver"
                linkText="Start Driving"
              />
              <UserTypeCard 
                icon={<ShieldCheck className="h-12 w-12 text-[#7ED957]" />}
                title="Support"
                description="Need help? Our support team is here to assist you with any questions."
                link="/support"
                linkText="Get Support"
              />
            </div>
          </div>
        </section>

        <AppFeatures />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}

function UserTypeCard({ 
  icon, 
  title, 
  description, 
  link, 
  linkText 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  link: string; 
  linkText: string; 
}) {
  return (
    <div className="bg-[#F7FDF9] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <Link href={link} className="mt-auto">
        <Button className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
          {linkText}
        </Button>
      </Link>
    </div>
  );
}