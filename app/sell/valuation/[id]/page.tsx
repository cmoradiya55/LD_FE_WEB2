import { Metadata } from 'next';
import Valuation from '@/app/sell/valuation/[id]/Valuation';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Valuation Report - AutoMarket',
    description: 'View your car valuation report with detailed condition assessment and market comparison.',
  };
}

export default function ValuationPage() {
  return <Valuation />;
}
