'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Car, Settings, Clock, LogOut, Shield, FileCheck, ChevronRight, ChevronDown, Cog } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { ShoppingCart } from 'lucide-react';

type MenuSubItem = {
    label: string;
    href: string;
};

type MenuItem = {
    label: string;
    icon: any;
    href?: string;
    subItems?: MenuSubItem[];
};

const menuItems: MenuItem[] = [
    { label: 'My Orders', icon: ShoppingCart, href: '/profile/my-order' },
    { label: 'Shortlisted Vehicles', icon: Heart, href: '/profile/shortlisted-vehicles' },
    // {
    //     label: 'My Activity',
    //     icon: Clock,
    //     subItems: [
    //         { label: 'Your used car searches', href: '/profile/my-activity/used-car-searches' },
    //         { label: 'Questions for you', href: '/profile/my-activity/questions-for-you' },
    //         { label: 'Answers', href: '/profile/my-activity/answers' },
    //         { label: 'Questions Asked', href: '/profile/my-activity/questions-asked' },
    //         { label: 'Your review', href: '/profile/my-activity/your-reviews' },
    //     ],
    // },
    { label: 'My Vehicles', icon: Car, href: '/profile/my-vehicles' },
    // { label: 'My Garage', icon: Cog, href: '/profile/my-garage' },
    { label: 'Manage Consents', icon: Shield, href: '/profile/manage-consents' },
    { label: 'Profile Settings', icon: Settings, href: '/profile/settings' },
];

interface ProfileLayoutProps {
    children: React.ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
    const pathname = usePathname();
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-3 sm:gap-4 lg:gap-8">
                {/* Left: Profile card + menu */}
                <aside className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Profile header */}
                    <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-gray-100 bg-gradient-to-b from-slate-50 to-white">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-lg sm:text-xl font-semibold">
                                C
                            </div>
                            <div className="flex-1">
                                <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                                    Admin
                                </h2>
                                <p className="text-xs text-slate-500">+91 9658743205</p>
                                <p className="text-xs text-slate-500">
                                    yourname@gmail.com{' '}
                                    <span className="text-emerald-600 font-semibold">Verified</span>
                                </p>
                            </div>
                        </div>

                        {/* Mobile: menu toggle */}
                        <div className="mt-4 flex items-center justify-between lg:hidden">
                            <p className="text-xs text-slate-500">Account menu</p>
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                            >
                                <span>{isMobileMenuOpen ? 'Hide menu' : 'Show menu'}</span>
                                <ChevronDown
                                    className={`h-3 w-3 transition-transform ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Menu */}
                    <nav
                        className={`
                            divide-y divide-gray-100
                            ${isMobileMenuOpen ? 'block' : 'hidden'}
                            lg:block
                        `}
                    >
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const hasActiveSubItem = hasSubItems
                                ? item.subItems!.some((sub) => pathname.startsWith(sub.href))
                                : false;
                            const isDirectActive = !hasSubItems && item.href !== undefined && pathname === item.href;
                            const isOpen = hasSubItems && (openSection === item.label || hasActiveSubItem);

                            return (
                                <div key={item.label}>
                                    {/* Parent row */}
                                    {item.href && !hasSubItems ? (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 text-left text-sm transition-colors ${isDirectActive
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'bg-white text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-xl border text-primary-600 ${isDirectActive
                                                    ? 'bg-white border-primary-200'
                                                    : 'bg-slate-50 border-slate-200 text-slate-500'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="flex-1 font-medium text-xs sm:text-sm">{item.label}</span>
                                            <ChevronRight className="w-4 h-4 text-slate-300" />
                                        </Link>
                                    ) : (
                                        <div
                                            className={`w-full flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 text-left text-sm cursor-pointer ${hasActiveSubItem ? 'text-primary-700' : 'text-slate-800'
                                                }`}
                                            onClick={() =>
                                                setOpenSection((prev) => (prev === item.label ? null : item.label))
                                            }
                                        >
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-xl border text-primary-600 ${hasActiveSubItem
                                                    ? 'bg-white border-primary-200'
                                                    : 'bg-slate-50 border-slate-200 text-slate-500'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="flex-1 font-medium text-xs sm:text-sm">{item.label}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-0 text-primary-600' : '-rotate-90'
                                                    }`}
                                            />
                                        </div>
                                    )}

                                    {/* Sub-items for My Activity */}
                                    {hasSubItems && isOpen && (
                                        <div className="bg-slate-50/70 border-t border-gray-100">
                                            {item.subItems!.map((sub) => {
                                                const isActive = pathname === sub.href;
                                                return (
                                                    <Link
                                                        key={sub.href}
                                                        href={sub.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`flex items-center gap-2 pl-10 sm:pl-14 pr-4 sm:pr-5 py-2.5 text-xs sm:text-sm rounded-md mx-2 sm:mx-3 my-0.5 transition-colors ${isActive
                                                            ? 'bg-primary-50 text-primary-700 font-semibold'
                                                            : 'text-slate-600 hover:bg-slate-100 hover:text-primary-700'
                                                            }`}
                                                    >
                                                        <span className="flex-1">{sub.label}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div
                        className={`
                            px-5 py-4 border-t border-gray-100
                            ${isMobileMenuOpen ? 'block' : 'hidden'}
                            lg:block
                        `}
                    >
                        <Button
                            variant="outline"
                            className="w-full justify-center gap-2 rounded-2xl border-gray-200 text-slate-700 hover:bg-slate-50"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </Button>
                    </div>
                </aside>

                {/* Right: Content card (children define inner content per page) */}
                <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    {children}
                </section>
            </div>
        </div>
    );
}


