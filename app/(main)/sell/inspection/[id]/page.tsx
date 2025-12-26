import { Metadata } from 'next';
import InspectionTracking from '@/app/(main)/sell/inspection/[id]/InspectionTracking';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Inspection Tracking - AutoMarket',
    description: 'Track the status of your car inspection and view progress updates.',
  };
}

export default function InspectionTrackingPage() {
  return <InspectionTracking />;
}
