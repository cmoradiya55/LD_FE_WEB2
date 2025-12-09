import { Metadata } from 'next';
import CarDetailsComponent from './CarDetailsComponent';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    title: 'Car Details - AutoMarket',
    description: 'View detailed information about this car including specifications, features, and pricing.',
  };
}

export default async function CarDetailsPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  return <CarDetailsComponent />;
}