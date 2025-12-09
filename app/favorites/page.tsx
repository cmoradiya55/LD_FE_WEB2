import { Metadata } from 'next';
import Favorites from '@/app/favorites/Favorites';

export const metadata: Metadata = {
  title: 'Saved Cars - AutoMarket',
  description: 'View your saved favorite cars on AutoMarket.',
};

export default function FavoritesPage() {
  return <Favorites />;
}
