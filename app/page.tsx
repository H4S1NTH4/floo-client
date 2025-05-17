import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing/landing-page';
import { cookies } from 'next/headers';

export default async function Home() {
  // Check for authentication cookie
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth-token');
  const userRole = cookieStore.get('user-role');

  // If user is authenticated and is a customer, redirect to customer home
  if (authCookie && userRole?.value === 'customer') {
    redirect('/customer/home');
  }

  // Otherwise show landing page
  return <LandingPage />;
}