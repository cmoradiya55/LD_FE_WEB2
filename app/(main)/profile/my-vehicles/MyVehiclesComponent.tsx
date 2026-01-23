'use client';

import { useState } from 'react';
import { CarFront, FileText } from 'lucide-react';
import CarCard from '@/components/CarCard/CarCard';
import { useQuery } from '@tanstack/react-query';
import { getMyUsedCarList, getMyUsedCarDetail } from '@/utils/auth';
import { Button } from '@/components/Button/Button';
import { UsedCarListingStatus } from '@/lib/data';
import InspectionReportModal from './Component/InspectionReportModal';

const MyVehiclesComponent = () => {

    const { data: vehiclesResponse, isLoading, error, refetch } = useQuery({
        queryKey: ['GET_MY_USED_CAR_LIST'],
        queryFn: async () => {
            try {
                const response = await getMyUsedCarList();
                if (response?.code === 200) {
                    return response.data;
                }
                return [];
            } catch (error) {
                console.error("Error fetching my used car list:", error);
                throw error;
            }
        },
        retry: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: 'always',
        enabled: true,
        gcTime: 0,
        staleTime: 0,
    });

    const vehicles = vehiclesResponse || [];

    const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [selectedCarData, setSelectedCarData] = useState<any>(null);

    const handleOpenReport = async (carId: number) => {
        setSelectedCarId(carId);
        setIsReportOpen(true);

        // Fetch the full car detail data
        try {
            const response = await getMyUsedCarDetail(String(carId));
            if (response?.code === 200) {
                setSelectedCarData(response.data);
            }
        } catch (error) {
            console.error("Error fetching car details:", error);
        }
    };

    const handleCloseReport = () => {
        setIsReportOpen(false);
        setSelectedCarId(null);
        setSelectedCarData(null);
        refetch();
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="space-y-1 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Vehicles you own or have listed</p>
                        <h2 className="text-xl font-semibold text-gray-900">
                            My Vehicles ({vehicles.length})
                        </h2>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <CarFront className="h-5 w-5 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Loading vehicles...</h3>
                    <p className="text-gray-600">
                        Please wait while we fetch your vehicles.
                    </p>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="rounded-2xl border border-dashed border-red-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <CarFront className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Error loading vehicles</h3>
                    <p className="text-gray-600">
                        {error instanceof Error ? error.message : 'Failed to load your vehicles. Please try again.'}
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && vehicles.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <CarFront className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No vehicles</h3>
                    <p className="text-gray-600">
                        Start by adding your first vehicle to sell.
                    </p>
                </div>
            )}

            {/* Vehicles Grid */}
            {!isLoading && !error && vehicles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {vehicles.map((car: any) => (
                        <div key={car.id} className='space-y-2'>
                            <div className='border border-gray-200 rounded-xl'>
                                <CarCard
                                    car={car}
                                    showActions={false}
                                    showFavorite={false}
                                    showStatusBadge={true}
                                />
                            </div>
                            {(car.status >= UsedCarListingStatus.APPROVED_BY_ADMIN) && (
                                <Button
                                    variant='secondary'
                                    className='w-full'
                                    onClick={() => handleOpenReport(car.id)}
                                >
                                    <FileText className='w-4 h-4 mr-2' />
                                    View Inspection Report
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <InspectionReportModal
                isOpen={isReportOpen}
                carId={selectedCarId}
                carData={selectedCarData}
                onClose={handleCloseReport}
            />

        </div>
    );
};

export default MyVehiclesComponent;