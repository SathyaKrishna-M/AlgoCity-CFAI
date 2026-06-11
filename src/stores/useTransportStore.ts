import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TransportLine {
  id: string;
  name: string;
  type: 'Metro' | 'Bus' | 'Tram';
  status: 'Active' | 'Delayed' | 'Suspended';
}

interface TransportState {
  lines: TransportLine[];
}

export const useTransportStore = create<TransportState>()(
  persist(
    (): TransportState => ({
      lines: [
        { id: 'M1', name: 'Red Line (North-South)', type: 'Metro', status: 'Active' },
        { id: 'M2', name: 'Blue Line (East-West)', type: 'Metro', status: 'Delayed' },
        { id: 'B1', name: 'Downtown Express', type: 'Bus', status: 'Active' },
        { id: 'B2', name: 'Tech Park Shuttle', type: 'Bus', status: 'Active' },
      ]
    }),
    { name: 'algocity-transport' }
  )
);
