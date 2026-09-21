'use client';

import React, { useState } from 'react';
import { Footer } from '@/components';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const PRODUCT_MENU = [
  { label: 'Home', href: '/#home' },
  { label: 'How it works', href: '/#how' },
  { label: 'Calculator', href: '/#calculator' },
  { label: 'Compare', href: '/#compare' },
  { label: 'Notes', href: '/#disclaimer' },
];

const MarketingLayout = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 md:flex md:items-center md:justify-between md:p-6">
        <div className="md:hidden flex items-center justify-between px-6 py-3 w-full rounded-xl backdrop-blur-lg bg-background/80 border border-foreground/10">
          <Link
            href="/#home"
            className="font-heading font-bold text-sm tracking-tight text-foreground hover:opacity-80 transition-opacity duration-300"
          >
            Neros Finance
          </Link>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1" aria-label="Menu">
            {isMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        <div className="hidden md:block">
          <Link
            href="/#home"
            className="inline-block p-3 font-heading font-bold text-base tracking-tight text-foreground hover:opacity-80 transition-opacity duration-300"
          >
            Neros Finance
          </Link>
        </div>

        <div className="hidden md:block relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 rounded-xl backdrop-blur-lg bg-background/80 border border-foreground/10 hover:border-foreground/20 transition-all duration-300"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 rounded-xl backdrop-blur-lg bg-background/95 border border-foreground/10 overflow-hidden">
              {PRODUCT_MENU.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="md:hidden relative w-full">
          {isMenuOpen && (
            <div className="w-full rounded-xl backdrop-blur-lg bg-background/95 border border-foreground/10 border-t-0 overflow-hidden">
              {PRODUCT_MENU.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto w-full z-40 relative">{children}</main>
      <Footer />
    </>
  );
};

export default MarketingLayout;
