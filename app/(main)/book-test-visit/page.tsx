import React from 'react';
import BookTestVisit from './BookTestVisit';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Test Visit - AutoMarket',
  description: 'Schedule a test visit to see and test drive the car. Book your appointment today.',
};

const BookTestVisitPage: React.FC = () => {
  return (
    <BookTestVisit />
  );
};

export default BookTestVisitPage;