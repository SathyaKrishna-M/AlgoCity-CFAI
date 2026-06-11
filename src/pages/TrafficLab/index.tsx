import {} from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CityMapEngine } from '../../components/map/CityMapEngine';
import { SimulationControls } from '../../components/simulation/SimulationControls';
import { useTrafficStore } from '../../stores/useTrafficStore';
import { useSimulationStore } from '../../stores/useSimulationStore';
import { Graph } from '../../algorithms/graph/types';
import type { GraphState } from '../../algorithms/graph/types';
import { bfsGenerator } from '../../algorithms/graph/bfs';
import { dfsGenerator } from '../../algorithms/graph/dfs';
import { dijkstraGenerator } from '../../algorithms/graph/dijkstra';

export function TrafficLab() {
  const trafficStore = useTrafficStore();
  const simStore = useSimulationStore();
  
  const [selectedAlgo, setSelectedAlgo] = useState<'BFS' | 'DFS' | 'Dijkstra'>('BFS');
  const [startNode, setStartNode] = useState<string>('A');
  const [targetNode, setTargetNode] = useState<string>('C');

  // Build the core Graph instance from the store state
  const buildGraph = () => {
    return new Graph(trafficStore.nodes, trafficStore.edges);
  };

  const handleRunSimulation = () => {
    const graph = buildGraph();
    let generator;
    
    switch(selectedAlgo) {
      case 'BFS':
        generator = bfsGenerator(graph, startNode, targetNode);
        break;
      case 'DFS':
        generator = dfsGenerator(graph, startNode, targetNode);
        break;
      case 'Dijkstra':
        generator = dijkstraGenerator(graph, startNode, targetNode);
        break;
    }
    
    // Execute generator and collect all steps
    const steps = [];
    for (const step of generator) {
      steps.push(step);
    }
    
    simStore.loadSimulation(steps);
    simStore.play();
  };

  // On unmount, pause and reset
  useEffect(() => {
    return () => {
      simStore.pause();
      simStore.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use the current step from the simulation store if active, else default static state
  const graphState = (simStore.getCurrentStep()?.stateSnapshot || {
    nodes: trafficStore.nodes,
    edges: trafficStore.edges,
    visited: [],
    frontier: [],
    activePath: [],
    distances: {}
  }) as unknown as GraphState;

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Traffic Management Lab</h1>
        <p className="text-gray-400">Simulate and optimize city traffic using graph algorithms.</p>
      </div>
      
      <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
        {/* Left Sidebar: Controls & Analytics */}
        <div className="col-span-1 flex flex-col gap-4 overflow-y-auto">
          <Card>
            <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Algorithm</label>
                <select 
                  className="p-2 border border-white/10 rounded-md bg-black/30 text-white focus:ring-primary text-sm [&>option]:bg-[#131B2A]"
                  value={selectedAlgo}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => setSelectedAlgo(e.target.value as any)}
                >
                  <option value="BFS">Breadth-First Search (BFS)</option>
                  <option value="DFS">Depth-First Search (DFS)</option>
                  <option value="Dijkstra">Dijkstra's Algorithm</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Start Node</label>
                <select 
                  className="p-2 border border-white/10 rounded-md bg-black/30 text-white focus:ring-primary text-sm [&>option]:bg-[#131B2A]"
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                >
                  {trafficStore.nodes.map(n => <option key={`start-${n.id}`} value={n.id}>{n.label} ({n.id})</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Target Node (Optional)</label>
                <select 
                  className="p-2 border border-white/10 rounded-md bg-black/30 text-white focus:ring-primary text-sm [&>option]:bg-[#131B2A]"
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                >
                  <option value="">None (Explore All)</option>
                  {trafficStore.nodes.map(n => <option key={`target-${n.id}`} value={n.id}>{n.label} ({n.id})</option>)}
                </select>
              </div>
              
              <Button onClick={handleRunSimulation} className="w-full mt-2">
                Run Simulation
              </Button>
            </CardContent>
          </Card>

          <SimulationControls />

          {simStore.getCurrentStep() && (
            <Card>
              <CardHeader>
                <CardTitle>Current Operation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] rounded-md text-sm">
                  {simStore.getCurrentStep()?.metadata.description}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="flex flex-col p-2 bg-black/30 border border-white/5 rounded">
                    <span className="text-gray-500 text-xs">Operations</span>
                    <span className="font-mono font-semibold text-white">{simStore.getCurrentStep()?.metrics.operations}</span>
                  </div>
                  <div className="flex flex-col p-2 bg-black/30 border border-white/5 rounded">
                    <span className="text-gray-500 text-xs">Comparisons</span>
                    <span className="font-mono font-semibold text-white">{simStore.getCurrentStep()?.metrics.comparisons}</span>
                  </div>
                  <div className="flex flex-col p-2 bg-black/30 border border-white/5 rounded">
                    <span className="text-gray-500 text-xs">Queue/Stack Max</span>
                    <span className="font-mono font-semibold text-white">{simStore.getCurrentStep()?.metrics.memoryUsed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Area: Graph Canvas */}
        <div className="col-span-3 min-h-0 relative rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <CityMapEngine simState={graphState} />
        </div>
      </div>
    </div>
  );
}
