import React from 'react';
import SellCarDetails from './SellCarDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Car Details - AutoMarket',
  description: 'Review and confirm your car listing details before submitting for inspection.',
};

const SellCarDetailsPage: React.FC = () => {
  return (
    <SellCarDetails />
  );
};

export default SellCarDetailsPage;
























// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { ChevronLeft, CheckCircle2, MapPin, Calendar, Gauge, DollarSign, User, Camera, Image as ImageIcon } from 'lucide-react';
// import { brandOptions, sellFlowSteps } from '../addCar/data';

// interface CarDetails {
//   brand: string;
//   year: string;
//   model: string;
//   variant: string;
//   ownership: string;
//   odometer: string;
//   location: string;
//   price: string;
//   photos: string;
// }

// const CarDetailsPage: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
//   const [brandLogo, setBrandLogo] = useState<string>('');

//   useEffect(() => {
//     // Get car details from URL params
//     const details: CarDetails = {
//       brand: searchParams.get('brand') || '',
//       year: searchParams.get('year') || '',
//       model: searchParams.get('model') || '',
//       variant: searchParams.get('variant') || '',
//       ownership: searchParams.get('ownership') || '',
//       odometer: searchParams.get('odometer') || '',
//       location: searchParams.get('location') || '',
//       price: searchParams.get('price') || '',
//       photos: searchParams.get('photos') || '',
//     };

//     // Find brand logo
//     const brand = brandOptions.find((b) => b.name === details.brand);
//     if (brand) {
//       setBrandLogo(brand.logo);
//     }

//     setCarDetails(details);
//   }, [searchParams]);

//   if (!carDetails) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-slate-600">Loading car details...</p>
//         </div>
//       </div>
//     );
//   }

//   const detailItems = [
//     {
//       id: 'brand',
//       label: 'Brand',
//       value: carDetails.brand,
//       icon: brandLogo ? (
//         <img src={brandLogo} alt={carDetails.brand} className="w-6 h-6 object-contain" />
//       ) : null,
//     },
//     {
//       id: 'year',
//       label: 'Year',
//       value: carDetails.year,
//       icon: <Calendar className="w-5 h-5" />,
//     },
//     {
//       id: 'model',
//       label: 'Model',
//       value: carDetails.model,
//       icon: null,
//     },
//     {
//       id: 'variant',
//       label: 'Variant',
//       value: carDetails.variant,
//       icon: null,
//     },
//     {
//       id: 'ownership',
//       label: 'Ownership',
//       value: carDetails.ownership,
//       icon: <User className="w-5 h-5" />,
//     },
//     {
//       id: 'odometer',
//       label: 'Odometer',
//       value: carDetails.odometer,
//       icon: <Gauge className="w-5 h-5" />,
//     },
//     {
//       id: 'location',
//       label: 'Location',
//       value: carDetails.location,
//       icon: <MapPin className="w-5 h-5" />,
//     },
//     {
//       id: 'price',
//       label: 'Price',
//       value: carDetails.price,
//       icon: <DollarSign className="w-5 h-5" />,
//     },
//     {
//       id: 'photos',
//       label: 'Photos',
//       value: carDetails.photos === 'upload-now' ? 'Upload Myself' : carDetails.photos === 'need-help' ? 'Need Photography Support' : carDetails.photos,
//       icon: carDetails.photos === 'upload-now' ? <ImageIcon className="w-5 h-5" /> : <Camera className="w-5 h-5" />,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
//         {/* Header */}
//         <header className="flex items-center gap-3">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-primary-600 hover:border-primary-300 transition-colors shadow-sm"
//           >
//             <ChevronLeft className="w-5 h-5" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Car Details</h1>
//             <p className="text-sm text-slate-500">Review your selected car information</p>
//           </div>
//         </header>

//         {/* Main Card */}
//         <div className="rounded-2xl bg-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)] border border-slate-100 overflow-hidden">
//           {/* Hero Section */}
//           <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-white p-6 sm:p-8 border-b border-slate-100">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//               {brandLogo && (
//                 <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-white border-2 border-primary-100 p-3 flex items-center justify-center shadow-sm">
//                   <img src={brandLogo} alt={carDetails.brand} className="w-full h-full object-contain" />
//                 </div>
//               )}
//               <div className="flex-1">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
//                   {carDetails.brand} {carDetails.model}
//                 </h2>
//                 <p className="text-lg text-slate-600 mb-2">{carDetails.variant}</p>
//                 <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
//                   <span className="flex items-center gap-1.5">
//                     <Calendar className="w-4 h-4" />
//                     {carDetails.year}
//                   </span>
//                   <span className="flex items-center gap-1.5">
//                     <MapPin className="w-4 h-4" />
//                     {carDetails.location}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex-shrink-0">
//                 <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl px-6 py-3 shadow-lg">
//                   <p className="text-xs font-semibold text-white/80 mb-1">Price</p>
//                   <p className="text-2xl font-bold text-white">{carDetails.price}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Details Grid */}
//           <div className="p-6 sm:p-8">
//             <h3 className="text-lg font-semibold text-slate-900 mb-4">All Details</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {detailItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-slate-50 hover:border-primary-200 transition-all duration-200"
//                 >
//                   <div className="flex items-start gap-3">
//                     {item.icon && (
//                       <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
//                         {item.icon}
//                       </div>
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
//                         {item.label}
//                       </p>
//                       <p className="text-sm font-semibold text-slate-900 break-words">
//                         {item.value || 'Not specified'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Summary Section */}
//           <div className="border-t border-slate-100 bg-gradient-to-r from-emerald-50 via-green-50 to-white p-6 sm:p-8">
//             <div className="flex items-start gap-3">
//               <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
//                 <CheckCircle2 className="w-6 h-6 text-emerald-600" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-slate-900 mb-2">All Information Complete</h3>
//                 <p className="text-sm text-slate-600 mb-4">
//                   You've successfully provided all the necessary details for your car listing. Your car information is ready to be submitted.
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {detailItems
//                     .filter((item) => item.value)
//                     .map((item) => (
//                       <span
//                         key={item.id}
//                         className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-xs font-medium text-emerald-700"
//                       >
//                         <CheckCircle2 className="w-3 h-3" />
//                         {item.label}
//                       </span>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <button
//             onClick={() => router.push('/sellCar/addCar')}
//             className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
//           >
//             Edit Details
//           </button>
//           <button
//             onClick={() => {
//               // Here you can add logic to submit the car listing
//               alert('Car listing submitted successfully!');
//             }}
//             style={{
//               background: `linear-gradient(to right, var(--color-gradient-from), var(--color-gradient-to))`
//             }}
//             className="flex-1 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
//           >
//             Submit Listing
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarDetailsPage;

