import { create } from 'zustand';
import { useTrafficStore } from './useTrafficStore';
import { useCityStore } from './useCityStore';

interface CityEngineState {
  isCityRunning: boolean;
  tickRateMs: number;
  day: number;
  time: string; // HH:MM
  
  startEngine: () => void;
  pauseEngine: () => void;
  resetEngine: () => void;
  setTickRate: (ms: number) => void;
}

let engineTimer: ReturnType<typeof setInterval> | null = null;
let currentMinutes = 480; // Start at 8:00 AM

export const useCityEngine = create<CityEngineState>((set, get) => ({
  isCityRunning: false,
  tickRateMs: 2000,
  day: 1,
  time: '08:00',

  startEngine: () => {
    const state = get();
    if (state.isCityRunning) return;

    set({ isCityRunning: true });

    engineTimer = setInterval(() => {
      // Advance time
      currentMinutes += 15;
      let d = get().day;
      if (currentMinutes >= 1440) {
        currentMinutes = 0;
        d++;
      }
      
      const hours = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
      const mins = (currentMinutes % 60).toString().padStart(2, '0');
      set({ time: `${hours}:${mins}`, day: d });

      // Trigger mutations
      useTrafficStore.getState().mutateTraffic();
      
      // Update global metrics slightly to look alive
      const cityStore = useCityStore.getState();
      useCityStore.setState({
        vehicles: Math.max(5000, cityStore.vehicles + (Math.random() > 0.5 ? 120 : -90)),
        deliveries: cityStore.deliveries + Math.floor(Math.random() * 3),
      });

    }, get().tickRateMs);
  },

  pauseEngine: () => {
    if (engineTimer) clearInterval(engineTimer);
    set({ isCityRunning: false });
  },

  resetEngine: () => {
    if (engineTimer) clearInterval(engineTimer);
    currentMinutes = 480;
    set({ isCityRunning: false, time: '08:00', day: 1 });
  },

  setTickRate: (ms) => {
    set({ tickRateMs: ms });
    if (get().isCityRunning) {
      get().pauseEngine();
      get().startEngine();
    }
  }
}));
