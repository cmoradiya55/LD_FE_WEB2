'use client';

import { MapPin, X, Search } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { updateCity } from '@/lib/auth';
import { getStorageItem, setStorageItem } from '@/lib/storage';

interface CityData {
  id: number;
  stateName: string;
  cityName: string;
}

interface LocationModalProps {
  open: boolean;
  selectedCity: CityData | null;
  setSelectedCity: (city: CityData | null ) => void;
  onClose: () => void;
  activeCitiesData: CityData[];
}

export function  LocationModal({ open, selectedCity, setSelectedCity, onClose, activeCitiesData }: LocationModalProps) {
  const [locationSearch, setLocationSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setLocationSearch('');
    onClose();
  };

  const filteredCities = activeCitiesData.filter((city: CityData) =>
    city.cityName.toLowerCase().includes(locationSearch.toLowerCase()),
  );

  const handleSelectCity = (city: CityData) => {
    console.log('city', city);
    setSelectedCity(city);
  }

  const handleApply = async() => {
    setIsLoading(true);
    if (!selectedCity || !activeCitiesData) {
      handleClose();
      return;
    }
    console.log('getStorageItem(token)', getStorageItem('token'));
    
    if(getStorageItem('token')) {
      console.log('selectedCity', selectedCity);
      const updateCityResponse = await updateCity(selectedCity.id, {})
      console.log('updateCityResponse', updateCityResponse)
      setIsLoading(false);
    } else {
      handleClose();
      setStorageItem('city', String(selectedCity.id));
      return;
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
              {filteredCities.map((city: CityData) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    handleSelectCity(city);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-colors ${
                    selectedCity?.cityName === city.cityName
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/70 text-slate-700'
                  }`}
                >
                  <span className="truncate">{city.cityName}</span>
                  {selectedCity?.cityName === city.cityName && (
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
                handleClose();
                setSelectedCity(null);
              }}
              className="text-xs hover:underline text-slate-500 hover:text-slate-700"
            >
              Clear location
            </button>
            <Button
              variant="primary"
              className="px-4 py-2 text-sm rounded-xl"
              onClick={handleApply}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Apply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
