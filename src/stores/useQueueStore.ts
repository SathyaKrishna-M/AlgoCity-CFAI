import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ticket {
  id: string;
  serviceType: string;
  issueTime: string;
  status: 'Waiting' | 'Serving' | 'Resolved';
}

interface QueueState {
  waitingLine: Ticket[];
  servingCounters: { counterId: number; currentTicket: Ticket | null }[];
}

export const useQueueStore = create<QueueState>()(
  persist(
    (): QueueState => ({
      waitingLine: [
        { id: 'T-042', serviceType: 'Property Registration', issueTime: '10:45 AM', status: 'Waiting' },
        { id: 'T-043', serviceType: 'ID Renewal', issueTime: '10:48 AM', status: 'Waiting' },
        { id: 'T-044', serviceType: 'Tax Services', issueTime: '10:52 AM', status: 'Waiting' },
        { id: 'T-045', serviceType: 'General Inquiry', issueTime: '10:55 AM', status: 'Waiting' },
      ],
      servingCounters: [
        { counterId: 1, currentTicket: { id: 'T-040', serviceType: 'ID Renewal', issueTime: '10:30 AM', status: 'Serving' } },
        { counterId: 2, currentTicket: { id: 'T-041', serviceType: 'Tax Services', issueTime: '10:35 AM', status: 'Serving' } },
        { counterId: 3, currentTicket: null },
      ]
    }),
    { name: 'algocity-queue' }
  )
);
