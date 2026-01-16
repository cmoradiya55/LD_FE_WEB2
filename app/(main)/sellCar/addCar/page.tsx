import React from 'react';
import { Metadata } from 'next';
import AddCardComponent from './AddCardComponent';

export const metadata: Metadata = {
  title: 'Add Car - AutoMarket',
  description: 'Add a new car to the marketplace. List your car for sale with detailed information.',
};

const AddCarPage = () => {
  return (
    <div className="min-h-screen">
      <AddCardComponent />
    </div>
  );
};

export default AddCarPage;