export interface SimulationMetadata {
  description: string;
  activeElements: string[]; // Node IDs or Edge IDs currently being processed
  visitedElements: string[]; // Elements already fully processed
  codeLine?: number; // Optional reference to pseudocode
}

export interface SimulationMetrics {
  operations: number;
  comparisons: number;
  memoryUsed?: number; // E.g., max queue size
}

export interface SimulationStep<T> {
  stepId: number;
  stateSnapshot: T;
  metadata: SimulationMetadata;
  metrics: SimulationMetrics;
}

export interface AlgorithmResult<T> {
  steps: SimulationStep<T>[];
  finalState: T;
  totalMetrics: SimulationMetrics;
  path?: string[]; // Optional final path (for routing algorithms)
}
