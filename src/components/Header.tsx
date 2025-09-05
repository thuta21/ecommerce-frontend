'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-primary flex-shrink-0">
            E-Shop
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>

          <nav className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Mobile Search Button */}
            <form onSubmit={handleSearch} className="md:hidden">
              <Button variant="ghost" size="sm" type="submit" className="p-2">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <Link href="/products" className="hidden sm:block">
              <Button variant="ghost" size="sm">Products</Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="sm" className="p-2">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                  </Button>
                </Link>

                <Link href="/orders" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Orders</Button>
                </Link>

                <div className="hidden sm:flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm truncate max-w-20 lg:max-w-none">{user?.name}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile User Menu */}
                <div className="sm:hidden">
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </form>
      </div>
    </header>
  );
}