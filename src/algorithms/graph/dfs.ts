import { Graph } from './types';
import type { GraphState } from './types';
import type { SimulationStep, SimulationMetrics } from '../../simulation/types';

export function* dfsGenerator(
  graph: Graph,
  startNodeId: string,
  targetNodeId?: string
): Generator<SimulationStep<GraphState>, void, unknown> {
  const visited = new Set<string>();
  const stack: string[] = [];
  const previous: Record<string, string | null> = {};
  
  let operations = 0;
  let comparisons = 0;
  
  stack.push(startNodeId);
  previous[startNodeId] = null;
  operations++;

  const getState = (activePath: string[] = []): GraphState => ({
    nodes: graph.getNodes(),
    edges: graph.getEdges(),
    visited: Array.from(visited),
    frontier: [...stack],
    activePath,
    previous: { ...previous }
  });

  const getMetrics = (): SimulationMetrics => ({
    operations,
    comparisons,
    memoryUsed: stack.length
  });

  yield {
    stepId: operations,
    stateSnapshot: getState(),
    metadata: {
      description: `Start DFS from node ${startNodeId}`,
      activeElements: [startNodeId],
      visitedElements: Array.from(visited)
    },
    metrics: getMetrics()
  };

  while (stack.length > 0) {
    const current = stack.pop()!;
    operations++;
    
    comparisons++;
    if (!visited.has(current)) {
      visited.add(current);
      
      yield {
        stepId: ++operations,
        stateSnapshot: getState([current]),
        metadata: {
          description: `Pop node ${current} from stack and mark visited`,
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

      // Add neighbors to stack (reverse order for standard DFS behavior if adjacency list is ordered)
      const neighbors = graph.getNeighbors(current);
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        operations++;
        comparisons++;
        if (!visited.has(neighbor.target)) {
          previous[neighbor.target] = current;
          stack.push(neighbor.target);
          
          yield {
            stepId: ++operations,
            stateSnapshot: getState([current, neighbor.target]),
            metadata: {
              description: `Pushed unvisited neighbor ${neighbor.target} to stack via edge ${neighbor.edgeId}.`,
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
      description: `Stack is empty. DFS complete.`,
      activeElements: [],
      visitedElements: Array.from(visited)
    },
    metrics: getMetrics()
  };
}
