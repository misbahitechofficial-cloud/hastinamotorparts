'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SelectedVehicle {
  type: 'MOTORCYCLE' | 'SCOOTER' | 'TUKTUK' | 'CAR';
  brandId: number;
  brandName: string;
  brandSlug: string;
  modelId: number;
  modelName: string;
  modelSlug: string;
  year?: number;
}

interface VehicleContextType {
  selectedVehicle: SelectedVehicle | null;
  setVehicle: (vehicle: SelectedVehicle) => void;
  clearVehicle: () => void;
  isSelectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hastina_selected_vehicle');
      if (saved) {
        setSelectedVehicle(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load selected vehicle from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        if (selectedVehicle) {
          localStorage.setItem('hastina_selected_vehicle', JSON.stringify(selectedVehicle));
        } else {
          localStorage.removeItem('hastina_selected_vehicle');
        }
      } catch (e) {
        console.error('Failed to sync vehicle to localStorage:', e);
      }
    }
  }, [selectedVehicle, isLoaded]);

  const setVehicle = (vehicle: SelectedVehicle) => {
    setSelectedVehicle(vehicle);
    setIsSelectorOpen(false);
  };

  const clearVehicle = () => {
    setSelectedVehicle(null);
  };

  const openSelector = () => setIsSelectorOpen(true);
  const closeSelector = () => setIsSelectorOpen(false);

  return (
    <VehicleContext.Provider
      value={{
        selectedVehicle,
        setVehicle,
        clearVehicle,
        isSelectorOpen,
        openSelector,
        closeSelector
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
}
