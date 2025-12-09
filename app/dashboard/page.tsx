import { Metadata } from 'next';
import Dashboard from '@/app/dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - AutoMarket',
  description: 'Manage your car listings, view bids, and track your activity on AutoMarket.',
};

export default function DashboardPage() {
  return <Dashboard />;
}
