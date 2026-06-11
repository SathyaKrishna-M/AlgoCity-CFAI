import { create } from 'zustand';
import type { SimulationStep } from '../simulation/types';

interface SimulationState {
  steps: SimulationStep<unknown>[];
  currentStepIndex: number;
  isPlaying: boolean;
  speedMultiplier: number; // e.g., 1x, 2x
  baseIntervalMs: number; // default interval between steps

  // Computed / accessors
  getCurrentStep: () => SimulationStep<unknown> | null;
  getIsFinished: () => boolean;

  // Actions
  loadSimulation: (steps: SimulationStep<unknown>[]) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSpeed: (multiplier: number) => void;
  goToStep: (index: number) => void;
}

// Keep the timer reference outside the state so it's not reactive
let playbackTimer: ReturnType<typeof setInterval> | null = null;

export const useSimulationStore = create<SimulationState>((set, get) => ({
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speedMultiplier: 1,
  baseIntervalMs: 1000,

  getCurrentStep: () => {
    const state = get();
    return state.steps.length > 0 ? state.steps[state.currentStepIndex] : null;
  },

  getIsFinished: () => {
    const state = get();
    return state.steps.length > 0 && state.currentStepIndex >= state.steps.length - 1;
  },

  loadSimulation: (steps) => {
    if (playbackTimer) clearInterval(playbackTimer);
    set({ steps, currentStepIndex: 0, isPlaying: false });
  },

  play: () => {
    const state = get();
    if (state.isPlaying || state.getIsFinished()) return;

    set({ isPlaying: true });

    playbackTimer = setInterval(() => {
      const currentState = get();
      if (currentState.currentStepIndex >= currentState.steps.length - 1) {
        if (playbackTimer) clearInterval(playbackTimer);
        set({ isPlaying: false });
      } else {
        set({ currentStepIndex: currentState.currentStepIndex + 1 });
      }
    }, state.baseIntervalMs / state.speedMultiplier);
  },

  pause: () => {
    if (playbackTimer) clearInterval(playbackTimer);
    set({ isPlaying: false });
  },

  reset: () => {
    if (playbackTimer) clearInterval(playbackTimer);
    set({ currentStepIndex: 0, isPlaying: false });
  },

  stepForward: () => {
    const state = get();
    if (playbackTimer) clearInterval(playbackTimer);
    if (state.currentStepIndex < state.steps.length - 1) {
      set({ currentStepIndex: state.currentStepIndex + 1, isPlaying: false });
    }
  },

  stepBackward: () => {
    const state = get();
    if (playbackTimer) clearInterval(playbackTimer);
    if (state.currentStepIndex > 0) {
      set({ currentStepIndex: state.currentStepIndex - 1, isPlaying: false });
    }
  },

  setSpeed: (multiplier) => {
    const state = get();
    set({ speedMultiplier: multiplier });
    // Restart interval with new speed if playing
    if (state.isPlaying) {
      get().pause();
      get().play();
    }
  },

  goToStep: (index) => {
    const state = get();
    if (playbackTimer) clearInterval(playbackTimer);
    const safeIndex = Math.max(0, Math.min(index, state.steps.length - 1));
    set({ currentStepIndex: safeIndex, isPlaying: false });
  }
}));
