import React from 'react';
import CustomerLayout from '@/components/customer/customer-layout';

export default function CustomerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerLayout>{children}</CustomerLayout>;
}