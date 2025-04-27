"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Home, Search, ClipboardList, Heart, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { useCart } from '@/components/providers/cart-provider';

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  badge?: number;
};

function NavItem({ href, icon, label, isActive, badge }: NavItemProps) {
  return (
    <Link href={href} className="w-full">
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start ${isActive ? 'bg-[#7ED957] hover:bg-[#6bc548] text-white' : ''}`}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
          {badge ? (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {badge > 9 ? '9+' : badge}
            </span>
          ) : null}
        </div>
      </Button>
    </Link>
  );
}

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7FDF9] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/customer/home" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[#7ED957]" />
            <span className="font-bold text-xl">Floo</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/customer/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7ED957] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/customer/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-white p-4">
          <nav className="space-y-2">
            <NavItem
              href="/customer/home"
              icon={<Home className="h-5 w-5" />}
              label="Home"
              isActive={pathname === '/customer/home'}
            />
            <NavItem
              href="/customer/search"
              icon={<Search className="h-5 w-5" />}
              label="Search"
              isActive={pathname === '/customer/search'}
            />
            <NavItem
              href="/customer/orders"
              icon={<ClipboardList className="h-5 w-5" />}
              label="Orders"
              isActive={pathname.startsWith('/customer/orders')}
            />
            <NavItem
              href="/customer/favorites"
              icon={<Heart className="h-5 w-5" />}
              label="Favorites"
              isActive={pathname === '/customer/favorites'}
            />
            <NavItem
              href="/customer/cart"
              icon={<ShoppingCart className="h-5 w-5" />}
              label="Cart"
              isActive={pathname === '/customer/cart'}
              badge={itemCount}
            />
            <NavItem
              href="/customer/profile"
              icon={<User className="h-5 w-5" />}
              label="Profile"
              isActive={pathname === '/customer/profile'}
            />
          </nav>
          
          <div className="mt-8 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-500"
              onClick={() => logout()}
            >
              Logout
            </Button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="block md:hidden border-t bg-white">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Link href="/customer/home" className="text-center">
            <Button
              variant="ghost"
              size="icon"
              className={`w-full ${pathname === '/customer/home' ? 'text-[#7ED957]' : ''}`}
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/customer/search" className="text-center">
            <Button
              variant="ghost"
              size="icon"
              className={`w-full ${pathname === '/customer/search' ? 'text-[#7ED957]' : ''}`}
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/customer/cart" className="text-center">
            <Button
              variant="ghost"
              size="icon"
              className={`w-full relative ${pathname === '/customer/cart' ? 'text-[#7ED957]' : ''}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7ED957] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/customer/orders" className="text-center">
            <Button
              variant="ghost"
              size="icon"
              className={`w-full ${pathname.startsWith('/customer/orders') ? 'text-[#7ED957]' : ''}`}
            >
              <ClipboardList className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/customer/profile" className="text-center">
            <Button
              variant="ghost"
              size="icon"
              className={`w-full ${pathname === '/customer/profile' ? 'text-[#7ED957]' : ''}`}
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}