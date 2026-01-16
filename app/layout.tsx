import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CityProvider } from '@/components/providers/CityProvider';

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
          <AuthProvider>
            <CityProvider>
              {children}
            </CityProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

