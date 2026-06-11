import { Graph } from './types';
import type { GraphState } from './types';
import type { SimulationStep, SimulationMetrics } from '../../simulation/types';

export function* dijkstraGenerator(
  graph: Graph,
  startNodeId: string,
  targetNodeId?: string
): Generator<SimulationStep<GraphState>, void, unknown> {
  const visited = new Set<string>();
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  
  // Simple priority queue using an array (for educational visualization)
  const pq: { id: string; dist: number }[] = [];
  
  let operations = 0;
  let comparisons = 0;

  // Initialize
  for (const node of graph.getNodes()) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  }
  
  distances[startNodeId] = 0;
  pq.push({ id: startNodeId, dist: 0 });
  operations++;

  const getState = (activePath: string[] = []): GraphState => ({
    nodes: graph.getNodes(),
    edges: graph.getEdges(),
    visited: Array.from(visited),
    frontier: pq.map(i => i.id),
    activePath,
    distances: { ...distances },
    previous: { ...previous }
  });

  const getMetrics = (): SimulationMetrics => ({
    operations,
    comparisons,
    memoryUsed: pq.length
  });

  yield {
    stepId: operations,
    stateSnapshot: getState(),
    metadata: {
      description: `Start Dijkstra from node ${startNodeId}. Initialize distances to Infinity.`,
      activeElements: [startNodeId],
      visitedElements: Array.from(visited)
    },
    metrics: getMetrics()
  };

  while (pq.length > 0) {
    // Sort array to simulate min-priority queue
    pq.sort((a, b) => a.dist - b.dist);
    const { id: current, dist: currentDist } = pq.shift()!;
    operations++;

    if (visited.has(current)) {
      comparisons++;
      continue;
    }

    visited.add(current);

    yield {
      stepId: ++operations,
      stateSnapshot: getState([current]),
      metadata: {
        description: `Extract min node ${current} with distance ${currentDist}. Mark visited.`,
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
          description: `Target ${targetNodeId} reached! Shortest path cost: ${currentDist}.`,
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
        comparisons++;
        if (neighbor.weight < 0) {
           throw new Error(`Dijkstra's algorithm cannot handle negative weights (edge ${neighbor.edgeId})`);
        }
        
        const newDist = currentDist + neighbor.weight;
        
        yield {
          stepId: ++operations,
          stateSnapshot: getState([current, neighbor.target]),
          metadata: {
            description: `Check edge to ${neighbor.target}. Current dist: ${distances[neighbor.target]}, New potential dist: ${newDist}`,
            activeElements: [current, neighbor.target, neighbor.edgeId],
            visitedElements: Array.from(visited)
          },
          metrics: getMetrics()
        };

        comparisons++;
        if (newDist < distances[neighbor.target]) {
          distances[neighbor.target] = newDist;
          previous[neighbor.target] = current;
          pq.push({ id: neighbor.target, dist: newDist });

          yield {
            stepId: ++operations,
            stateSnapshot: getState([current, neighbor.target]),
            metadata: {
              description: `Relax edge ${neighbor.edgeId}. Distance to ${neighbor.target} updated to ${newDist}. Added to PQ.`,
              activeElements: [neighbor.target, neighbor.edgeId],
              visitedElements: Array.from(visited)
            },
            metrics: getMetrics()
          };
        }
      }
    }
  }

  yield {
    stepId: ++operations,
    stateSnapshot: getState(),
    metadata: {
      description: `Priority queue is empty. Dijkstra complete.`,
      activeElements: [],
      visitedElements: Array.from(visited)
    },
    metrics: getMetrics()
  };
}
