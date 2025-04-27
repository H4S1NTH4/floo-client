import React from 'react';
import { Search, Utensils, Bike, Check } from 'lucide-react';

export function HowItWorks() {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How it works</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Getting your favorite food delivered is as easy as 1-2-3.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard 
            icon={<Search className="h-8 w-8 text-white" />}
            step={1}
            title="Browse restaurants"
            description="Find your favorite restaurants or discover new ones nearby."
          />
          <StepCard 
            icon={<Utensils className="h-8 w-8 text-white" />}
            step={2}
            title="Choose your meal"
            description="Select your favorite dishes and add them to your cart."
          />
          <StepCard 
            icon={<Bike className="h-8 w-8 text-white" />}
            step={3}
            title="Track your order"
            description="Follow your order in real-time as it makes its way to you."
          />
          <StepCard 
            icon={<Check className="h-8 w-8 text-white" />}
            step={4}
            title="Enjoy your food"
            description="Receive your food and enjoy a delicious meal without leaving home."
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({ 
  icon, 
  step, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  step: number; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow transition-shadow duration-300 relative">
      <div className="flex items-center justify-center w-14 h-14 bg-[#7ED957] rounded-full mb-6">
        {icon}
      </div>
      <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
        <span className="font-bold text-gray-700">{step}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}