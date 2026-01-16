'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { useQueryClient } from '@tanstack/react-query';

interface CityData {
  id: number;
  stateName: string;
  cityName: string;
}

interface CityContextType {
  cityId: string | null;
  selectedCity: CityData | null;
  setCity: (city: CityData | null) => void;
  updateCity: (cityId: string) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [cityId, setCityId] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  // Initialize city from localStorage on mount
  useEffect(() => {
    const storedCityId = getStorageItem('city');
    if (storedCityId) {
      setCityId(storedCityId);
    }
  }, []);

  // Update city and invalidate queries
  const updateCity = useCallback((newCityId: string) => {
    setStorageItem('city', newCityId);
    setCityId(newCityId);
    
    // Invalidate all listing queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['GET_CAR_LISTINGS_DATA'] });
    queryClient.invalidateQueries({ queryKey: ['GET_CAR_LISTINGS'] });
  }, [queryClient]);

  // Set city with full city data
  const setCity = useCallback((city: CityData | null) => {
    if (city) {
      updateCity(String(city.id));
      setSelectedCity(city);
    } else {
      setCityId(null);
      setSelectedCity(null);
      // Remove from localStorage if clearing
      if (typeof window !== 'undefined') {
        localStorage.removeItem('city');
      }
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['GET_CAR_LISTINGS_DATA'] });
      queryClient.invalidateQueries({ queryKey: ['GET_CAR_LISTINGS'] });
    }
  }, [updateCity, queryClient]);

  // Listen for storage changes (in case city is updated in another tab/window)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'city') {
        const newCityId = e.newValue;
        if (newCityId !== cityId) {
          setCityId(newCityId);
          queryClient.invalidateQueries({ queryKey: ['GET_CAR_LISTINGS_DATA'] });
          queryClient.invalidateQueries({ queryKey: ['GET_CAR_LISTINGS'] });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [cityId, queryClient]);

  const value: CityContextType = {
    cityId,
    selectedCity,
    setCity,
    updateCity,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}

