import { Metadata } from 'next';
import MyListings from '@/app/my-listings/MyListings';

export const metadata: Metadata = {
  title: 'My Listings - AutoMarket',
  description: 'Manage your car listings, track bids, and view listing status on AutoMarket.',
};

export default function MyListingsPage() {
  return <MyListings />;
}
