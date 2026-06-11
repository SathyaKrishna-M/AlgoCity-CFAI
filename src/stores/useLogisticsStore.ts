import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DeliveryTruck {
  id: string;
  status: 'In Transit' | 'Loading' | 'Idle';
  destination: string;
  targetNode: string;
}

interface LogisticsState {
  warehouses: { id: string; name: string; capacity: number; currentStock: number; }[];
  trucks: DeliveryTruck[];
  dispatchTruck: (id: string) => void;
}

export const useLogisticsStore = create<LogisticsState>()(
  persist(
    (set) => ({
      warehouses: [
        { id: 'W1', name: 'Central Hub', capacity: 10000, currentStock: 8500 },
        { id: 'W2', name: 'North Distribution', capacity: 5000, currentStock: 2100 },
        { id: 'W3', name: 'South Depot', capacity: 7500, currentStock: 7400 },
      ],
      trucks: [
        { id: 'T-101', status: 'In Transit', destination: 'Sector 4', targetNode: 'o_n' },
        { id: 'T-102', status: 'Idle', destination: '-', targetNode: 'o_s' },
        { id: 'T-103', status: 'Loading', destination: 'Sector 9', targetNode: 'o_e' },
      ],
      dispatchTruck: (id) => set((state) => ({
        trucks: state.trucks.map(t => t.id === id ? { ...t, status: 'In Transit' } : t)
      }))
    }),
    { name: 'algocity-logistics' }
  )
);
