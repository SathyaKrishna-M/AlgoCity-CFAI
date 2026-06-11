import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Map to lucide icon in UI
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const initialAchievements: Achievement[] = [
  { id: 'traffic_engineer', title: 'Traffic Engineer', description: 'Complete 10 traffic simulations.', icon: 'car', unlocked: false, progress: 0, maxProgress: 10 },
  { id: 'emergency_commander', title: 'Emergency Commander', description: 'Resolve 25 incidents.', icon: 'shield', unlocked: false, progress: 0, maxProgress: 25 },
  { id: 'logistics_expert', title: 'Logistics Expert', description: 'Complete 100 deliveries.', icon: 'package', unlocked: false, progress: 0, maxProgress: 100 },
  { id: 'city_architect', title: 'City Architect', description: 'Create 10 custom cities.', icon: 'building', unlocked: false, progress: 0, maxProgress: 10 },
  { id: 'algorithm_master', title: 'Algorithm Master', description: 'Run all graph algorithms (BFS, DFS, Dijkstra, A*, Bellman-Ford).', icon: 'brain', unlocked: false, progress: 0, maxProgress: 5 },
];

interface AchievementState {
  achievements: Achievement[];
  incrementProgress: (id: string, amount?: number) => void;
  unlockAchievement: (id: string) => void;
  getUnlockedCount: () => number;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: initialAchievements,
      
      incrementProgress: (id, amount = 1) => set((state) => {
        const updated = state.achievements.map(ach => {
          if (ach.id === id && !ach.unlocked) {
            const newProgress = Math.min(ach.progress + amount, ach.maxProgress);
            const isUnlocked = newProgress >= ach.maxProgress;
            // Optionally, trigger a toast notification here if it unlocks
            return { ...ach, progress: newProgress, unlocked: isUnlocked };
          }
          return ach;
        });
        return { achievements: updated };
      }),

      unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map(ach => 
          ach.id === id ? { ...ach, unlocked: true, progress: ach.maxProgress } : ach
        )
      })),

      getUnlockedCount: () => get().achievements.filter(a => a.unlocked).length
    }),
    {
      name: 'algocity-achievements' // localStorage key
    }
  )
);
