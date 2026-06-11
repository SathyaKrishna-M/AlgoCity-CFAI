import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CityRecord {
  id: string;
  name: string;
  value: number; // e.g., year of registration, id number
  left?: CityRecord;
  right?: CityRecord;
}

interface RecordsState {
  rootRecord: CityRecord | null;
  totalRecords: number;
  insertRecord: (record: Omit<CityRecord, 'left' | 'right'>) => void;
  resetTree: () => void;
}

const insertNode = (root: CityRecord | null, newNode: CityRecord): CityRecord => {
  if (!root) return newNode;
  if (newNode.value < root.value) {
    return { ...root, left: insertNode(root.left || null, newNode) };
  } else {
    return { ...root, right: insertNode(root.right || null, newNode) };
  }
};

const defaultRoot: CityRecord = {
  id: 'R1',
  name: 'John Doe',
  value: 500,
  left: {
    id: 'R2',
    name: 'Alice Smith',
    value: 250,
    left: { id: 'R4', name: 'Charlie', value: 100 },
    right: { id: 'R5', name: 'Diana', value: 300 }
  },
  right: {
    id: 'R3',
    name: 'Bob Johnson',
    value: 750,
    left: { id: 'R6', name: 'Eve', value: 600 },
    right: { id: 'R7', name: 'Frank', value: 900 }
  }
};

export const useRecordsStore = create<RecordsState>()(
  persist(
    (set) => ({
      totalRecords: 7,
      rootRecord: defaultRoot,
      insertRecord: (record) => set((state) => {
        const newNode: CityRecord = { ...record };
        if (!state.rootRecord) {
          return { rootRecord: newNode, totalRecords: state.totalRecords + 1 };
        }
        return {
          rootRecord: insertNode(state.rootRecord, newNode),
          totalRecords: state.totalRecords + 1
        };
      }),
      resetTree: () => set({ rootRecord: defaultRoot, totalRecords: 7 })
    }),
    { name: 'algocity-records' }
  )
);
