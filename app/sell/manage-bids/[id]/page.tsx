import { Metadata } from 'next';
import ManageBids from '@/app/sell/manage-bids/[id]/ManageBids';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Manage Bids - AutoMarket',
    description: 'View and manage bids for your car listing on AutoMarket.',
  };
}

export default function ManageBidsPage() {
  return <ManageBids />;
}
