'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Car,
  Heart,
  User,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Browse', icon: Home },
  { href: '/listings', label: 'Cars Listing', icon: Car },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard', label: 'Dashboard', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-white/95 backdrop-blur-lg border-r border-slate-200 shadow-[4px_0_20px_rgba(15,23,42,0.06)] z-40">
      <nav className="w-full px-2 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center justify-center w-full px-3 py-3 rounded-2xl transition-all ${isActive
                ? 'bg-primary-50 text-primary-600 shadow-inner shadow-primary-100'
                : 'text-slate-500 hover:text-primary-600 hover:bg-primary-50/70'
                }`}
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                {item.label}
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

