import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { FavoritesProvider } from '@/components/providers/FavoritesProvider';

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
        <QueryProvider>
          <FavoritesProvider>
            <Header />
            <Sidebar />
            <main className="min-h-screen md:ml-16">
              {children}
            </main>
          </FavoritesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

