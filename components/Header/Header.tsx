'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Car,
  Heart,
  User,
  Plus,
  Menu,
  X,
  Phone,
  Headphones,
  LogIn,
  LogOut,
  ShoppingBag,
  ShieldCheck,
  Settings2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button/Button';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRefMobile = useRef<HTMLDivElement>(null);
  const profileMenuRefDesktop = useRef<HTMLDivElement>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideMobile = profileMenuRefMobile.current && !profileMenuRefMobile.current.contains(target);
      const isOutsideDesktop = profileMenuRefDesktop.current && !profileMenuRefDesktop.current.contains(target);

      if (profileMenuOpen && isOutsideMobile && isOutsideDesktop) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const navItems = [
    { href: '/', label: 'Browse', icon: Home },
    { href: '/my-listings', label: 'My Listings', icon: Car },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/dashboard', label: 'Dashboard', icon: User },
  ];

  const profileMenuItems = [
    { href: '/profile/my-order', label: 'My Orders', icon: ShoppingBag },
    { href: '/profile/shortlisted-vehicles', label: 'Shortlisted Vehicles', icon: Heart },
    { href: '/profile/my-vehicles', label: 'My Vehicles', icon: Car },
    { href: '/profile/manage-consents', label: 'Manage Consents', icon: ShieldCheck },
    { href: '/profile/settings', label: 'Profile Settings', icon: Settings2 },
  ];

  // Hide header on sell car pages
  // if (pathname?.startsWith('/sellCar')) {
  //   return null;
  // }

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-white shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
        {/* Mobile Header - Compact Design */}
        <div className="md:hidden">
          <div className="px-4 py-1">
            <div className="flex items-center justify-between">
              {/* Logo - Smaller on mobile */}
              <Link href="/" className="flex items-center -mt-2">
                <Image
                  src="/logo.webp"
                  alt="AutoMarket Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </Link>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                {/* Support Button - Icon only on mobile */}
                <Link
                  href="/support"
                  className="flex items-center justify-center p-3 rounded-xl bg-white/80 hover:bg-white border border-gray-200 transition-colors"
                >
                  <Headphones className="w-5 h-5 text-slate-600" />
                </Link>

                {/* Profile Button - Icon only on mobile */}
                <div className="relative" ref={profileMenuRefMobile}>
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className="flex items-center justify-center p-3 rounded-xl bg-white/80 hover:bg-white border border-gray-200 transition-colors"
                  >
                    <User className="w-5 h-5 text-slate-600" />
                  </button>

                  {/* Mobile Profile Menu */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.16)] border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                          My Account
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile/my-order"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <ShoppingBag className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              My Orders
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/profile/shortlisted-vehicles"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <Heart className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              Shortlisted Vehicles
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/profile/my-vehicles"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <Car className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              My Vehicles
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/profile/manage-consents"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <ShieldCheck className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              Manage Consents
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/profile/settings"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <Settings2 className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              Profile Settings
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 text-slate-700 transition-colors min-w-[44px] flex items-center justify-center"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header Section */}
        <div className="hidden md:block px-4 sm:px-6 lg:px-8 shadow-md">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center h-16 md:h-16 lg:h-16 2xl:h-20 text-slate-900">
              {/* Logo */}
              <Link href="/" className="flex items-center -mt-4 sm:space-x-2">
                <Image
                  src="/logo.webp"
                  alt="AutoMarket Logo"
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </Link>

              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {/* Customer Support */}
                <Link
                  href="/support"
                  className="group relative flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all duration-200"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100 transition-colors">
                    <Headphones className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-slate-700 group-hover:text-primary-600">
                    Support
                  </span>
                </Link>

                {/* CTA Button */}
                <div className="flex items-center space-x-2">
                  <Button
                    href="/sellCar/registrationNumber"
                    variant="primary"
                    className="flex items-center text-sm space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Sell Car</span>
                  </Button>
                </div>

                {/* Login Button */}
                <Button
                  variant="ghost"
                  className="group relative flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all duration-200"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100 transition-colors">
                    <LogIn className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-slate-700 group-hover:text-primary-600">
                    Login
                  </span>
                </Button>

                {/* Profile */}
                <div
                  className="relative flex items-center gap-2"
                  ref={profileMenuRefDesktop}
                // onMouseEnter={() => setProfileMenuOpen(true)}
                // onMouseLeave={() => setProfileMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60"
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="hidden lg:inline text-sm font-medium text-slate-700">
                      Profile
                    </span>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.16)] border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                          My Account
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile/my-order"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <ShoppingBag className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              My Orders
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/profile/shortlisted-vehicles"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <Heart className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              Shortlisted Vehicles
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/profile/my-vehicles"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <Car className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              My Vehicles
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/profile/manage-consents"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <ShieldCheck className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              Manage Consents
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/profile/settings"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/70 transition-colors group"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100">
                            <Settings2 className="w-4 h-4 text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700">
                              Profile Settings
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Mobile Menu - Enhanced Design */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-xl">
            {/* User Actions Section */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary-50/50 to-secondary-50/50">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/80 hover:bg-white border border-gray-200"
                >
                  <LogIn className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-700">Login</span>
                </Button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="py-2 px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-primary-50 text-primary-600 shadow-sm'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 active:bg-primary-50/70'
                      }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-100' : 'bg-slate-100'}`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-600'}`} />
                    </div>
                    <span className="font-semibold text-base">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary-600"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Logout */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  // Add logout logic here
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors border border-gray-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Sell Car CTA */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <Button
                href="/sellCar/registrationNumber"
                variant="primary"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plus className="w-5 h-5" />
                <span>Sell Your Car</span>
              </Button>
            </div>
          </div>
        )}

      </header>

      {/* Bottom Mobile Navigation - Enhanced */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(15,23,42,0.08)]">
        <div className="flex justify-around items-center h-16 text-sm px-2 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-200 relative ${isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 active:text-primary-600'
                  }`}
              >
                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-600 border-2 border-white"></div>
                  )}
                </div>
                <span className={`text-[11px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for bottom navigation on mobile */}
      <div className="md:hidden h-6 bg-gray-100"></div>
    </>
  );
}

