import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing/landing-page';

export default function Home() {
  // This would normally check server-side session
  // For now, we'll just show the landing page
  return <LandingPage />;
}