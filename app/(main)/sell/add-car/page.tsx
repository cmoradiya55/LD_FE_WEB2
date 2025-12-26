import { Metadata } from 'next';
import AddCar from '@/app/(main)/sell/add-car/AddCar';

export const metadata: Metadata = {
  title: 'Add Car - AutoMarket',
  description: 'List your car for sale on AutoMarket. Add car details, upload photos, and submit for inspection.',
};

const AddCarPage: React.FC = () => {
  return <AddCar />;
};

export default AddCarPage;
