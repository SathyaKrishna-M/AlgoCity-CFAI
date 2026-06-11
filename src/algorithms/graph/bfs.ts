import { Graph } from './types';
import type { GraphState } from './types';
import type { SimulationStep, SimulationMetrics } from '../../simulation/types';

export function* bfsGenerator(
  graph: Graph,
  startNodeId: string,
  targetNodeId?: string
): Generator<SimulationStep<GraphState>, void, unknown> {
  const visited = new Set<string>();
  const queue: string[] = [];
  const previous: Record<string, string | null> = {};
  
  let operations = 0;
  let comparisons = 0;
  
  // Initialize
  queue.push(startNodeId);
  visited.add(startNodeId);
  previous[startNodeId] = null;
  operations++;

  const getState = (activePath: string[] = []): GraphState => ({
    nodes: graph.getNodes(),
    edges: graph.getEdges(),
    visited: Array.from(visited),
    frontier: [...queue],
    activePath,
    previous: { ...previous }
  });

  const getMetrics = (): SimulationMetrics => ({
    operations,
    comparisons,
    memoryUsed: queue.length
  });

  yield {
    stepId: operations,
    stateSnapshot: getState(),
    metadata: {
      description: `Start BFS from node ${startNodeId}`,
      activeElements: [startNodeId],
      visitedElements: Array.from(visited)
    },
    metrics: getMetrics()
  };

  while (queue.length > 0) {
    const current = queue.shift()!;
    operations++;
    
    yield {
      stepId: operations,
      stateSnapshot: getState([current]),
      metadata: {
        description: `Dequeue node ${current} and examine neighbors`,
        activeElements: [current],
        visitedElements: Array.from(visited)
      },
      metrics: getMetrics()
    };

    comparisons++;
    if (targetNodeId && current === targetNodeId) {
      // Reconstruct path
      let curr = targetNodeId;
      const path = [];
      while (curr) {
        path.unshift(curr);
        curr = previous[curr] as string;
      }
      
      yield {
        stepId: ++operations,
        stateSnapshot: getState(path),
        metadata: {
          description: `Target ${targetNodeId} found! Path reconstructed.`,
          activeElements: path,
          visitedElements: Array.from(visited)
        },
        metrics: getMetrics()
      };
      return;
    }

    const neighbors = graph.getNeighbors(current);
    for (const neighbor of neighbors) {
      operations++;
      comparisons++;
      if (!visited.has(neighbor.target)) {
        visited.add(neighbor.target);
        previous[neighbor.target] = current;
        queue.push(neighbor.target);
        
        yield {
          stepId: ++operations,
          stateSnapshot: getState([current, neighbor.target]),
          metadata: {
            description: `Discovered new neighbor ${neighbor.target} via edge ${neighbor.edgeId}. Added to queue.`,
            activeElements: [neighbor.target, neighbor.edgeId],
            visitedElements: Array.from(visited)
          },
          metrics: getMetrics()
        };
      }
    }
  }

  yield {
    stepId: ++operations,
    stateSnapshot: getState(),
    metadata: {
      description: `Queue is empty. BFS complete.`,
      activeElements: [],
      visitedElements: Array.from(visited)
    },
    metrics: getMetrics()
  };
}
