import { Metadata } from 'next';
import Home from '@/components/Home/Home';

export const metadata: Metadata = {
  title: 'AutoMarket - Buy & Sell Verified Used Cars',
  description: 'Browse thousands of verified used cars. Search by brand, model, price, and more. Your trusted marketplace for buying and selling cars.',
};

export default function HomePage() {
  return <Home />;
}

