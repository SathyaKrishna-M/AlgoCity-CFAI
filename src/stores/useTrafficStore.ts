import { create } from 'zustand';
import defaultGraphData from '../city-graph.json';

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

const initialLayout = defaultGraphData as { nodes: TrafficNode[], edges: TrafficEdge[] };

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
