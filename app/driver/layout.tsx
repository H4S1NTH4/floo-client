'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Here you would typically check if the user is authenticated and is a driver
    // For now, we'll just show a toast to indicate this would be protected
    toast({
      title: "Driver Area",
      description: "This is a protected driver section",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}