import { create } from 'zustand';

export interface Incident {
  id: string;
  type: 'Fire' | 'Medical' | 'Police';
  priority: number;
  location: string;
  status: 'Pending' | 'Dispatched' | 'Resolved';
  targetNode: string;
}

interface EmergencyState {
  incidents: Incident[];
  ambulancesAvailable: number;
  fireTrucksAvailable: number;
  policeCarsAvailable: number;
  addIncident: (incident: Incident) => void;
  dispatchIncident: (id: string) => void;
}

export const useEmergencyStore = create<EmergencyState>((set) => ({
  incidents: [
    { id: 'INC-001', type: 'Medical', priority: 1, location: 'North Hills', targetNode: 'o_n', status: 'Pending' },
    { id: 'INC-002', type: 'Fire', priority: 2, location: 'Downtown', targetNode: 'c', status: 'Dispatched' },
    { id: 'INC-003', type: 'Police', priority: 3, location: 'South Side', targetNode: 'o_s', status: 'Pending' },
  ],
  ambulancesAvailable: 5,
  fireTrucksAvailable: 2,
  policeCarsAvailable: 8,
  
  addIncident: (incident) => set((state) => ({
    incidents: [...state.incidents, incident].sort((a, b) => a.priority - b.priority) // Basic PQ simulation for now
  })),
  dispatchIncident: (id) => set((state) => ({
    incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status: 'Dispatched' } : inc)
  }))
}));
