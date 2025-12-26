import { Metadata } from 'next';
import CarsListingsPageComponent from './CarsListingsPageComponent';

export const metadata: Metadata = {
  title: 'Cars Listing - AutoMarket',
  description: 'Manage your car listings, track bids, and view listing status on AutoMarket.',
};

export default function CarsListingsPage() {
  return <CarsListingsPageComponent />;
}
