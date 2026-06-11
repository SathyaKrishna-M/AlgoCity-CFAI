import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlannerAction {
  id: string;
  type: string;
  description: string;
}

interface PlannerState {
  undoStack: PlannerAction[];
  redoStack: PlannerAction[];
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    () => ({
      undoStack: [
        { id: 'a1', type: 'BUILD_ROAD', description: 'Built road on Sector 4' },
        { id: 'a2', type: 'ZONE_COMMERCIAL', description: 'Zoned block C2 as Commercial' },
      ],
      redoStack: [
        { id: 'a3', type: 'DEMOLISH', description: 'Demolished old factory' }
      ]
    }),
    { name: 'algocity-planner' }
  )
);
