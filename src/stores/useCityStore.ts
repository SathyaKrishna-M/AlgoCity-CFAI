import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CityState {
  population: number;
  activeRoads: number;
  emergencyRequests: number;
  vehicles: number;
  serviceCenters: number;
  deliveries: number;
  systemStatus: {
    traffic: string;
    emergency: string;
    transport: string;
  };
}

export const useCityStore = create<CityState>()(
  persist(
    () => ({
      population: 1420500,
      activeRoads: 432,
      emergencyRequests: 12,
      vehicles: 8540,
      serviceCenters: 5,
      deliveries: 154,
      systemStatus: {
        traffic: 'Optimal',
        emergency: 'Busy',
        transport: 'Active',
      }
    }),
    {
      name: 'algocity-state'
    }
  )
);
