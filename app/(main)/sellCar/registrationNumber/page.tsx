import React from 'react';  
import RegistrationNumberComponent from "./RegistrationNumberComponent";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Registration Number - AutoMarket',
    description: 'Enter your registration number to sell your car.',
};

const RegistrationNumberPage = () => {
    return <RegistrationNumberComponent />;
};

export default RegistrationNumberPage;