import React from 'react';
import { MapPin, Clock, Search, CreditCard } from 'lucide-react';

export function AppFeatures() {
  return (
    <section className="py-16 px-4 md:px-8 bg-[#F7FDF9]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why choose Floo?</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We're committed to making food delivery simple, fast, and convenient for everyone.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Search className="h-8 w-8 text-[#7ED957]" />}
            title="Discover local favorites"
            description="Explore a wide selection of restaurants in your area and find your new favorites."
          />
          <FeatureCard 
            icon={<Clock className="h-8 w-8 text-[#7ED957]" />}
            title="Real-time tracking"
            description="Know exactly when your food will arrive with our accurate real-time tracking."
          />
          <FeatureCard 
            icon={<MapPin className="h-8 w-8 text-[#7ED957]" />}
            title="Precise delivery"
            description="Get your food delivered right to your door with our precise location tracking."
          />
          <FeatureCard 
            icon={<CreditCard className="h-8 w-8 text-[#7ED957]" />}
            title="Easy payments"
            description="Pay securely and easily with multiple payment options, including credit cards."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow transition-shadow duration-300">
      <div className="flex items-center justify-center w-14 h-14 bg-[#f0faea] rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}