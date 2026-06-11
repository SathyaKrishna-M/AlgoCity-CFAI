import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Timer, AlertOctagon, HeartPulse, TrainTrack, Car } from 'lucide-react';
import { useTrafficStore } from '../../stores/useTrafficStore';
import { Graph } from '../../algorithms/graph/types';
import { bfsGenerator } from '../../algorithms/graph/bfs';
import { dfsGenerator } from '../../algorithms/graph/dfs';
import { dijkstraGenerator } from '../../algorithms/graph/dijkstra';
import type { SimulationMetrics } from '../../simulation/types';

interface RaceResult {
  algo: string;
  metrics: SimulationMetrics;
  pathLength: number;
  cost: number;
  rank: number;
}

export function ChallengeMode() {
  const trafficStore = useTrafficStore();
  const [results, setResults] = useState<RaceResult[]>([]);
  const [isRacing, setIsRacing] = useState(false);

  const scenarioChallenges = [
    { id: 'traffic-1', title: 'Traffic Jam Crisis', description: 'Reduce downtown congestion below 20%.', icon: <Car className="w-6 h-6" />, category: 'Traffic', difficulty: 'Medium' },
    { id: 'emergency-1', title: 'Hospital Overload', description: 'Dispatch resources to 15 pending incidents optimally.', icon: <HeartPulse className="w-6 h-6" />, category: 'Emergency', difficulty: 'Hard' },
    { id: 'transport-1', title: 'Metro Failure', description: 'Reroute 500 passengers due to Central station outage.', icon: <TrainTrack className="w-6 h-6" />, category: 'Transport', difficulty: 'Extreme' },
  ];

  const handleStartRace = () => {
    setIsRacing(true);
    setResults([]);

    // We will run them sequentially in memory but it will look like a "result computation"
    const graph = new Graph(trafficStore.nodes, trafficStore.edges);
    const startNode = 'A';
    const targetNode = 'H'; // Furthest node usually

    setTimeout(() => {
      const raceData: Omit<RaceResult, 'rank'>[] = [];

      // Run BFS
      const bfsGen = bfsGenerator(graph, startNode, targetNode);
      let bfsLastStep;
      for (const step of bfsGen) { bfsLastStep = step; }
      raceData.push({
        algo: 'BFS',
        metrics: bfsLastStep!.metrics,
        pathLength: bfsLastStep!.stateSnapshot.activePath?.length || 0,
        cost: bfsLastStep!.stateSnapshot.activePath?.length || 0, // BFS just counts hops
      });

      // Run DFS
      const dfsGen = dfsGenerator(graph, startNode, targetNode);
      let dfsLastStep;
      for (const step of dfsGen) { dfsLastStep = step; }
      raceData.push({
        algo: 'DFS',
        metrics: dfsLastStep!.metrics,
        pathLength: dfsLastStep!.stateSnapshot.activePath?.length || 0,
        cost: dfsLastStep!.stateSnapshot.activePath?.length || 0,
      });

      // Run Dijkstra
      const dijGen = dijkstraGenerator(graph, startNode, targetNode);
      let dijLastStep;
      for (const step of dijGen) { dijLastStep = step; }
      raceData.push({
        algo: 'Dijkstra',
        metrics: dijLastStep!.metrics,
        pathLength: dijLastStep!.stateSnapshot.activePath?.length || 0,
        cost: dijLastStep!.stateSnapshot.distances?.[targetNode] || Infinity,
      });

      // Rank by operations (lowest is best)
      const ranked = raceData
        .sort((a, b) => a.metrics.operations - b.metrics.operations)
        .map((r, i) => ({ ...r, rank: i + 1 }));

      setResults(ranked);
      setIsRacing(false);
    }, 1000); // Artificial delay for effect
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">City Challenges & Race Arena</h1>
          <p className="text-gray-400">Solve crisis scenarios or watch algorithms compete in efficiency battles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {scenarioChallenges.map(sc => (
          <Card key={sc.id} className="flex flex-col border-t-4" style={{ borderTopColor: sc.difficulty === 'Medium' ? '#eab308' : sc.difficulty === 'Hard' ? '#f97316' : '#ef4444'}}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white">{sc.icon} {sc.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <p className="text-sm text-gray-400 flex-1">{sc.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 border border-white/10 ${sc.difficulty === 'Extreme' ? 'text-red-500' : sc.difficulty === 'Hard' ? 'text-amber-500' : 'text-yellow-500'}`}>
                  {sc.difficulty}
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
               <Button className="w-full" variant="outline">Start Scenario</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-white/10">
        <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-4">
          <Timer className="w-16 h-16 text-[#D4AF37]" />
          <h3 className="text-xl font-bold text-white">Awaiting Race Start</h3>
          <p className="text-gray-400">Select "Start Global Race" to benchmark BFS, DFS, and Dijkstra on the live city graph.</p>
          <Button size="lg" onClick={handleStartRace} disabled={isRacing} className="mt-4 px-12 text-lg">
            {isRacing ? 'Computing Race...' : 'Start Global Race'}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          <h3 className="text-xl font-bold mt-4 text-white">Live Leaderboard</h3>
          {results.map((result: RaceResult, idx) => (
            <div 
              key={result.algo}
              className={`flex flex-col p-4 rounded-xl border ${idx === 0 ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'bg-white/5 border-white/10'}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-2xl font-black text-white tracking-tight">{result.algo}</h4>
                <span className={`text-xs font-bold ${idx === 0 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {idx === 0 ? 'Winner 🏆' : `Rank ${result.rank}`}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm text-center">
                <div className="bg-black/30 p-2 rounded border border-white/5">
                  <span className="block text-gray-500 text-xs">Ops</span>
                  <span className="font-mono font-bold text-white">{result.metrics.operations}</span>
                </div>
                <div className="bg-black/30 p-2 rounded border border-white/5">
                  <span className="block text-gray-500 text-xs">Mem (Max)</span>
                  <span className="font-mono font-bold text-white">{result.metrics.memoryUsed}</span>
                </div>
                <div className="bg-black/30 p-2 rounded border border-white/5">
                  <span className="block text-gray-500 text-xs">Path Cost</span>
                  <span className="font-mono font-bold text-white">{result.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
