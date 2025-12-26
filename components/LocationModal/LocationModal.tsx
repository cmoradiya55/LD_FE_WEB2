'use client';

import { MapPin, X, Search } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getActiveCities, updateCity } from '@/lib/auth';
import { getUser, setUser } from '@/lib/storage';

interface LocationModalProps {
  open: boolean;
  selectedCity: string | null;
  onSelectCity: (city: string | null) => void;
  onClose: () => void;
}

interface CityData {
  id: number;
  stateName: string;
  cityName: string;
}

export function LocationModal({ open, selectedCity, onSelectCity, onClose }: LocationModalProps) {
  const [locationSearch, setLocationSearch] = useState('');

  const handleClose = () => {
    setLocationSearch('');
    onClose();
  };

  const { data: activeCitiesData } = useQuery({
    queryKey: ['GET_ACTIVE_CITIES'],
    queryFn: async () => {
      const res = await getActiveCities();
      const cityData = Array.isArray((res as any)?.data)
        ? (res as any).data
        : Array.isArray(res)
        ? res
        : [];

      return cityData.filter((city: any) => city?.cityName || city?.name || city?.displayName || city?.city);
    },
    enabled: open,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const updateCityMutation = useMutation({
    mutationFn: async ({ cityId, cityName, payload }: { cityId: string; cityName: string; payload: any }) => {
      return await updateCity(cityId, payload);
    },
    onSuccess: (response, variables) => {
      if (response && (response as any).code === 200) {
        const currentUser = getUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            cityId: variables.cityId,
            cityName: variables.cityName,
            // Set default isCityIncluded to true if not already set
            isCityIncluded: currentUser.isCityIncluded !== undefined && currentUser.isCityIncluded !== null 
              ? currentUser.isCityIncluded 
              : true,
          };
          setUser(updatedUser);
          // Dispatch custom event to notify other components
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('userDataUpdated'));
          }
        }
      }
      handleClose();
    },
    onError: (error) => {
      console.error('Failed to update city:', error);
    },
  });

  if (!open) return null;

  const cities: string[] =
    activeCitiesData && activeCitiesData.length
      ? activeCitiesData.map((city: CityData) => city.cityName || (city as any).name || (city as any).displayName || (city as any).city)
      : [];

  const filteredCities = cities.filter((city: string) =>
    city.toLowerCase().includes(locationSearch.toLowerCase()),
  );

  const handleApply = () => {
    if (!selectedCity || !activeCitiesData) {
      handleClose();
      return;
    }

    const selectedCityData = activeCitiesData.find(
      (city: CityData) =>
        (city.cityName || (city as any).name || (city as any).displayName || (city as any).city) === selectedCity
    );

    if (selectedCityData && selectedCityData.id) {
      updateCityMutation.mutate({
        cityId: String(selectedCityData.id),
        cityName: selectedCity,
        payload: {},
      });
    } else {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-50">
              <MapPin className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Choose your city</p>
              <p className="text-xs text-slate-500">
                Get personalized results based on your location
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pt-3 pb-4 space-y-4">
          {/* Search */}
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Search city"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500 placeholder:text-slate-400"
            />
          </div> */}

          {/* Popular cities */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Popular cities</p>
            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {filteredCities.map((city: string) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    onSelectCity(city);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-colors ${
                    selectedCity === city
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/70 text-slate-700'
                  }`}
                >
                  <span className="truncate">{city}</span>
                  {selectedCity === city && (
                    <span className="ml-2 h-1.5 w-1.5 rounded-full bg-primary-500" />
                  )}
                </button>
              ))}

              {filteredCities.length === 0 && (
                <p className="col-span-2 text-xs text-slate-500 text-center py-4">
                  No cities found. Try a different search.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
            <button
              type="button"
              onClick={() => {
                onSelectCity(null);
                handleClose();
              }}
              className="text-xs hover:underline text-slate-500 hover:text-slate-700"
            >
              Clear location
            </button>
            <Button
              variant="primary"
              className="px-4 py-2 text-sm rounded-xl"
              onClick={handleApply}
              disabled={updateCityMutation.isPending}
            >
              {updateCityMutation.isPending ? 'Updating...' : 'Apply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
