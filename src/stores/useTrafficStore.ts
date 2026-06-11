import { create } from 'zustand';

export type NodeType = 'hub' | 'hospital' | 'logistics' | 'transport' | 'residential' | 'commercial' | 'intersection';

export interface TrafficNode {
  id: string;
  x: number; // SVG coordinate
  y: number; // SVG coordinate
  label: string;
  type: NodeType;
}

export interface Point {
  x: number;
  y: number;
}

export interface TrafficEdge {
  id: string;
  source: string;
  target: string;
  baseWeight: number; // The original distance/cost
  weight: number; // The current dynamic cost
  isClosed: boolean;
  isDirected?: boolean; // Whether the edge is one-way
  points: Point[]; // Array of control points for the curve
}

export type SelectionType = { type: 'node', id: string } | { type: 'edge', id: string } | null;

interface TrafficState {
  nodes: TrafficNode[];
  edges: TrafficEdge[];
  startNode: string | null;
  endNode: string | null;
  
  // Editor State
  isEditorMode: boolean;
  selection: SelectionType;
  
  // Simulation Actions
  setStartNode: (id: string) => void;
  setEndNode: (id: string) => void;
  mutateTraffic: () => void;
  closeRoad: (edgeId: string) => void;
  openRoad: (edgeId: string) => void;

  // Editor Actions
  toggleEditorMode: () => void;
  setSelection: (selection: SelectionType) => void;
  addNode: (x: number, y: number) => void;
  moveNode: (id: string, x: number, y: number) => void;
  updateNode: (id: string, updates: Partial<TrafficNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (sourceId: string, targetId: string) => void;
  updateEdgePoints: (id: string, points: Point[]) => void;
  updateEdgeWeight: (id: string, weight: number) => void;
  deleteEdge: (id: string) => void;
  loadGraph: (nodes: TrafficNode[], edges: TrafficEdge[]) => void;
}

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Base Radial City Layout (mapped to background image)
const createRadialCityLayout = () => {
  const nodes: TrafficNode[] = [
    { id: 'c', x: 500, y: 400, label: 'Downtown Core', type: 'hub' },
    { id: 'i_n', x: 500, y: 260, label: '', type: 'intersection' },
    { id: 'i_e', x: 640, y: 400, label: '', type: 'intersection' },
    { id: 'i_s', x: 500, y: 540, label: '', type: 'intersection' },
    { id: 'i_w', x: 360, y: 400, label: '', type: 'intersection' },
    { id: 'i_ne', x: 600, y: 300, label: '', type: 'intersection' },
    { id: 'i_nw', x: 400, y: 300, label: '', type: 'intersection' },
    { id: 'i_se', x: 600, y: 500, label: '', type: 'intersection' },
    { id: 'i_sw', x: 400, y: 500, label: '', type: 'intersection' },
    { id: 'o_n', x: 500, y: 80, label: 'North Station', type: 'transport' },
    { id: 'o_e', x: 820, y: 400, label: 'East Terminal', type: 'transport' },
    { id: 'o_s', x: 500, y: 720, label: 'Industrial Park', type: 'logistics' },
    { id: 'o_w', x: 180, y: 400, label: 'West Terminal', type: 'transport' },
    { id: 'o_ne', x: 720, y: 180, label: 'Northeast Hospital', type: 'hospital' },
    { id: 'o_nw', x: 280, y: 180, label: 'University District', type: 'residential' },
    { id: 'o_se', x: 720, y: 620, label: 'Tech Park', type: 'commercial' },
    { id: 'o_sw', x: 280, y: 620, label: 'Port Logistics', type: 'logistics' },
  ];

  const edges: TrafficEdge[] = [
    // Center to Inner Ring
    { id: 'e_c_in', source: 'c', target: 'i_n', baseWeight: 2, weight: 2, isClosed: false, points: [] },
    { id: 'e_c_ie', source: 'c', target: 'i_e', baseWeight: 2, weight: 2, isClosed: false, points: [] },
    { id: 'e_c_is', source: 'c', target: 'i_s', baseWeight: 2, weight: 2, isClosed: false, points: [] },
    { id: 'e_c_iw', source: 'c', target: 'i_w', baseWeight: 2, weight: 2, isClosed: false, points: [] },

    // Inner Ring Circular
    { id: 'e_in_ine', source: 'i_n', target: 'i_ne', baseWeight: 1, weight: 1, isClosed: false, points: [{x: 560, y: 260}] },
    { id: 'e_ine_ie', source: 'i_ne', target: 'i_e', baseWeight: 1, weight: 1, isClosed: false, points: [{x: 640, y: 340}] },
    { id: 'e_ie_ise', source: 'i_e', target: 'i_se', baseWeight: 1, weight: 1, isClosed: false, points: [{x: 640, y: 460}] },
    { id: 'e_ise_is', source: 'i_se', target: 'i_s', baseWeight: 1, weight: 1, isClosed: false, points: [{x: 560, y: 540}] },
    { id: 'e_is_isw', source: 'i_s', target: 'i_sw', baseWeight: 1, weight: 1, isClosed: false, points: [{x: 440, y: 540}] },
    { id: 'e_isw_iw', source: 'i_sw', target: 'i_w', baseWeight: 1, weight: 1, isClosed: false, points: [{x: 360, y: 460}] },
    { id: 'e_iw_inw', source: 'i_w', target: 'i_nw', baseWeight: 1, weight: 1, isClosed: false, points: [{x: 360, y: 340}] },
    { id: 'e_inw_in', source: 'i_nw', target: 'i_n', baseWeight: 1, weight: 1, isClosed: false, points: [{x: 440, y: 260}] },

    // Inner to Outer Radial Spokes
    { id: 'e_in_on', source: 'i_n', target: 'o_n', baseWeight: 3, weight: 3, isClosed: false, points: [] },
    { id: 'e_ie_oe', source: 'i_e', target: 'o_e', baseWeight: 3, weight: 3, isClosed: false, points: [] },
    { id: 'e_is_os', source: 'i_s', target: 'o_s', baseWeight: 3, weight: 3, isClosed: false, points: [] },
    { id: 'e_iw_ow', source: 'i_w', target: 'o_w', baseWeight: 3, weight: 3, isClosed: false, points: [] },
    { id: 'e_ine_one', source: 'i_ne', target: 'o_ne', baseWeight: 4, weight: 4, isClosed: false, points: [] },
    { id: 'e_inw_onw', source: 'i_nw', target: 'o_nw', baseWeight: 4, weight: 4, isClosed: false, points: [] },
    { id: 'e_ise_ose', source: 'i_se', target: 'o_se', baseWeight: 4, weight: 4, isClosed: false, points: [] },
    { id: 'e_isw_osw', source: 'i_sw', target: 'o_sw', baseWeight: 4, weight: 4, isClosed: false, points: [] },

    // Outer Ring Circular
    { id: 'e_on_one', source: 'o_n', target: 'o_ne', baseWeight: 3, weight: 3, isClosed: false, points: [{x: 640, y: 80}] },
    { id: 'e_one_oe', source: 'o_ne', target: 'o_e', baseWeight: 3, weight: 3, isClosed: false, points: [{x: 820, y: 280}] },
    { id: 'e_oe_ose', source: 'o_e', target: 'o_se', baseWeight: 3, weight: 3, isClosed: false, points: [{x: 820, y: 520}] },
    { id: 'e_ose_os', source: 'o_se', target: 'o_s', baseWeight: 3, weight: 3, isClosed: false, points: [{x: 640, y: 720}] },
    { id: 'e_os_osw', source: 'o_s', target: 'o_sw', baseWeight: 3, weight: 3, isClosed: false, points: [{x: 360, y: 720}] },
    { id: 'e_osw_ow', source: 'o_sw', target: 'o_w', baseWeight: 3, weight: 3, isClosed: false, points: [{x: 180, y: 520}] },
    { id: 'e_ow_onw', source: 'o_w', target: 'o_nw', baseWeight: 3, weight: 3, isClosed: false, points: [{x: 180, y: 280}] },
    { id: 'e_onw_on', source: 'o_nw', target: 'o_n', baseWeight: 3, weight: 3, isClosed: false, points: [{x: 360, y: 80}] },
  ];

  return { nodes, edges };
};

const initialLayout = createRadialCityLayout();

export const useTrafficStore = create<TrafficState>((set) => ({
  nodes: initialLayout.nodes,
  edges: initialLayout.edges,
  startNode: null,
  endNode: null,
  isEditorMode: false,
  selection: null,

  setStartNode: (id) => set({ startNode: id }),
  setEndNode: (id) => set({ endNode: id }),
  
  mutateTraffic: () => set((state) => {
    if (state.isEditorMode) return state; // Don't mutate traffic during editing
    const newEdges = state.edges.map(edge => {
      if (edge.isClosed) return edge;
      const variation = Math.floor(Math.random() * 5) - 2; 
      let newWeight = edge.weight + variation;
      newWeight = Math.max(edge.baseWeight, Math.min(newWeight, edge.baseWeight * 3));
      return { ...edge, weight: newWeight };
    });
    return { edges: newEdges };
  }),

  closeRoad: (edgeId) => set((state) => ({
    edges: state.edges.map(e => e.id === edgeId ? { ...e, isClosed: true, weight: Infinity } : e)
  })),
  
  openRoad: (edgeId) => set((state) => ({
    edges: state.edges.map(e => e.id === edgeId ? { ...e, isClosed: false, weight: e.baseWeight } : e)
  })),

  toggleEditorMode: () => set((state) => ({ isEditorMode: !state.isEditorMode, selection: null })),
  setSelection: (selection) => set({ selection }),

  addNode: (x, y) => set((state) => {
    const newNode: TrafficNode = { id: `n_${generateId()}`, x, y, label: 'New Inter.', type: 'intersection' };
    return { nodes: [...state.nodes, newNode], selection: { type: 'node', id: newNode.id } };
  }),

  moveNode: (id, x, y) => set((state) => ({
    nodes: state.nodes.map(n => n.id === id ? { ...n, x, y } : n)
  })),

  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map(n => n.id === id ? { ...n, ...updates } : n)
  })),

  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== id),
    edges: state.edges.filter(e => e.source !== id && e.target !== id),
    selection: state.selection?.id === id ? null : state.selection
  })),

  addEdge: (sourceId, targetId) => set((state) => {
    const exists = state.edges.find(e => (e.source === sourceId && e.target === targetId) || (e.target === sourceId && e.source === targetId));
    if (exists || sourceId === targetId) return state;
    const newEdge: TrafficEdge = { id: `e_${generateId()}`, source: sourceId, target: targetId, baseWeight: 5, weight: 5, isClosed: false, points: [] };
    return { edges: [...state.edges, newEdge], selection: { type: 'edge', id: newEdge.id } };
  }),

  updateEdgePoints: (id, points) => set((state) => ({
    edges: state.edges.map(e => e.id === id ? { ...e, points } : e)
  })),

  updateEdgeWeight: (id, weight) => set((state) => ({
    edges: state.edges.map(e => e.id === id ? { ...e, baseWeight: weight, weight } : e)
  })),

  deleteEdge: (id) => set((state) => ({
    edges: state.edges.filter(e => e.id !== id),
    selection: state.selection?.id === id ? null : state.selection
  })),

  loadGraph: (nodes, edges) => set({ nodes, edges, selection: null })
}));
