import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-[#7ED957]" />
              <span className="font-bold text-xl">Floo</span>
            </div>
            <p className="text-gray-600 mb-4">
              Modern food delivery for everyone. Your favorite restaurants delivered to your door.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">For Customers</h3>
            <ul className="space-y-2">
              <FooterLink href="/customer/home">Order Food</FooterLink>
              <FooterLink href="/customer/restaurants">Restaurants</FooterLink>
              <FooterLink href="/customer/favorites">Favorites</FooterLink>
              <FooterLink href="/customer/orders">Order History</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">For Partners</h3>
            <ul className="space-y-2">
              <FooterLink href="/auth/restaurant/signup">Restaurant Sign-up</FooterLink>
              <FooterLink href="/driver/signup">Become a Driver</FooterLink>
              <FooterLink href="/auth/restaurant/dashboard">Restaurant Dashboard</FooterLink>
              <FooterLink href="/driver/earnings">Driver Earnings</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/help">Help Center</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Floo. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-500 text-sm hover:text-gray-700">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-500 text-sm hover:text-gray-700">Privacy Policy</Link>
            <Link href="/cookies" className="text-gray-500 text-sm hover:text-gray-700">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#7ED957] hover:text-white transition-colors duration-300">
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-600 hover:text-[#7ED957] transition-colors duration-200">
        {children}
      </Link>
    </li>
  );
}