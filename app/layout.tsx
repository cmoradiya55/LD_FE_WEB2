import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AutoMarket - Buy & Sell Verified Used Cars',
  description: 'A trusted marketplace for buying and selling verified used cars',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen pb-20 md:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}

