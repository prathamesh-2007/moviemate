'use client';

import { Film, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { path: '/', label: 'Discover' },
    { path: '/in-theaters', label: 'In Theaters' },
    { path: '/trending', label: 'Trending' },
    { path: '/popular', label: 'Popular' },
    { path: '/top-rated', label: 'Top Rated' },
    { path: '/watchlist', label: 'Watchlist' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 animate-slide-in">
            <Film className="h-6 w-6" />
            <span className="font-bold text-xl">MovieMate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item, index) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={pathname === item.path ? 'default' : 'ghost'}
                  size="sm"
                  className={`animate-fade-in smooth-transition`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <Film className="h-6 w-6" />
                    <span className="font-bold text-xl">MovieMate</span>
                  </div>
                  {navigationItems.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={pathname === item.path ? 'default' : 'ghost'}
                        className="w-full justify-start text-left"
                        size="lg"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}