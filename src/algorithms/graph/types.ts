export interface GraphNode {
  id: string;
  label: string;
  x: number; // for visualization
  y: number; // for visualization
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  baseWeight?: number; 
  isClosed?: boolean;
  isDirected?: boolean;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visited: string[];
  frontier: string[]; // e.g. queue or stack
  activePath: string[]; // e.g. the path currently being traversed or reconstructed
  distances?: Record<string, number>; // for Dijkstra / A*
  previous?: Record<string, string | null>; // for path reconstruction
}

export class Graph {
  nodes: Map<string, GraphNode> = new Map();
  edges: Map<string, GraphEdge> = new Map();
  adjacencyList: Map<string, { target: string; weight: number; edgeId: string; isClosed?: boolean }[]> = new Map();

  constructor(nodes: GraphNode[] = [], edges: GraphEdge[] = []) {
    nodes.forEach(n => this.addNode(n));
    edges.forEach(e => this.addEdge(e));
  }

  addNode(node: GraphNode) {
    this.nodes.set(node.id, node);
    if (!this.adjacencyList.has(node.id)) {
      this.adjacencyList.set(node.id, []);
    }
  }

  addEdge(edge: GraphEdge) {
    this.edges.set(edge.id, edge);
    this.adjacencyList.get(edge.source)?.push({ target: edge.target, weight: edge.weight, edgeId: edge.id, isClosed: edge.isClosed });
    
    if (!edge.isDirected) {
      this.adjacencyList.get(edge.target)?.push({ target: edge.source, weight: edge.weight, edgeId: edge.id, isClosed: edge.isClosed });
    }
  }

  getNeighbors(nodeId: string) {
    // Only return neighbors that are not closed
    return (this.adjacencyList.get(nodeId) || []).filter(n => !n.isClosed);
  }

  getNodes() {
    return Array.from(this.nodes.values());
  }

  getEdges() {
    return Array.from(this.edges.values());
  }
}
