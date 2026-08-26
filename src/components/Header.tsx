import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-color-border py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="font-display-lg text-primary">
          Chef Irfan Malik
        </Link>
        {/* Mobile hamburger */}
        <button className="md:hidden btn btn-ghost" aria-label="Open menu">
          <Menu size={24} />
        </button>
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          <Link href="/recipes" className="font-label-caps text-primary hover:text-secondary">
            Recipes
          </Link>
          <Link href="/about" className="font-label-caps text-primary hover:text-secondary">
            About
          </Link>
          <Link href="/gallery" className="font-label-caps text-primary hover:text-secondary">
            Gallery
          </Link>
          <Link href="/contact" className="font-label-caps text-primary hover:text-secondary">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};
