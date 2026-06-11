import { Package, Truck, Warehouse, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MetricCard } from '../../components/ui/MetricCard';
import { useLogisticsStore } from '../../stores/useLogisticsStore';
import type { DeliveryTruck } from '../../stores/useLogisticsStore';
import { CityMapEngine } from '../../components/map/CityMapEngine';
import { useTrafficStore } from '../../stores/useTrafficStore';
import { useSimulationStore } from '../../stores/useSimulationStore';
import { Graph } from '../../algorithms/graph/types';
import type { GraphState } from '../../algorithms/graph/types';
import { dfsGenerator } from '../../algorithms/graph/dfs';

export function LogisticsHub() {
  const { warehouses, trucks, dispatchTruck } = useLogisticsStore();
  const trafficStore = useTrafficStore();
  const simStore = useSimulationStore();

  const totalStock = warehouses.reduce((acc, w) => acc + w.currentStock, 0);
  const totalCap = warehouses.reduce((acc, w) => acc + w.capacity, 0);
  const overallCapacityPct = Math.round((totalStock / totalCap) * 100);

  const handleDispatch = (truck: DeliveryTruck) => {
    dispatchTruck(truck.id);
    const startNode = 'o_s'; // Logistics Industrial Park
    const graph = new Graph(trafficStore.nodes, trafficStore.edges);
    // DFS is used to search exhaustively for routing (as per learning hub text)
    const generator = dfsGenerator(graph, startNode, truck.targetNode);
    
    const steps = [];
    for (const step of generator) steps.push(step);
    
    simStore.loadSimulation(steps);
    simStore.setSpeed(2.0);
    simStore.play();
  };

  const graphState = (simStore.getCurrentStep()?.stateSnapshot || {
    nodes: trafficStore.nodes,
    edges: trafficStore.edges,
    visited: [],
    frontier: [],
    activePath: [],
    distances: {}
  }) as unknown as GraphState;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Logistics & Delivery Hub</h1>
        <p className="text-gray-400">Warehouse Inventory and Fleet Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Inventory" value={totalStock.toLocaleString()} icon={<Package />} />
        <MetricCard title="Warehouse Cap" value={`${overallCapacityPct}%`} icon={<Warehouse />} />
        <MetricCard title="Active Trucks" value={trucks.filter(t => t.status === 'In Transit').length} icon={<Truck />} />
        <MetricCard title="Delivery Success" value="98.5%" icon={<CheckCircle2 />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-gray-500" />
              Storage Depots
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            {warehouses.map(w => {
              const pct = Math.round((w.currentStock / w.capacity) * 100);
              return (
                <div key={w.id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-white">{w.name}</h5>
                    <span className="text-xs font-mono text-gray-500">{w.id}</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2 mb-1 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 font-semibold">
                    <span>{w.currentStock.toLocaleString()} Units</span>
                    <span>{pct}% Full</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="col-span-2 flex flex-col min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" />
                Fleet Status
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 bg-black/20 rounded-b-2xl border-t border-white/5 p-6 flex flex-col gap-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trucks.map(truck => (
                <div key={truck.id} className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                        ${truck.status === 'In Transit' ? 'bg-emerald-500' : truck.status === 'Loading' ? 'bg-amber-500' : 'bg-gray-400'}
                      `}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Truck {truck.id}</h4>
                        <p className="text-xs text-gray-400 font-medium">Destination: {truck.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                        ${truck.status === 'In Transit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          truck.status === 'Loading' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          'bg-white/5 text-gray-400 border border-white/10'}
                      `}>
                        {truck.status}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleDispatch(truck)} disabled={truck.status === 'In Transit'}>Route</Button>
                    </div>
                  </div>
                  
                  {truck.status === 'In Transit' && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-[shimmer_2s_infinite]" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">ETA 12 MIN</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-400">
              <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Delivery efficiency up 4% this week.</span>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1 lg:col-span-3 min-h-[400px] relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group mt-4">
          <CityMapEngine simState={graphState} />
        </div>
      </div>
    </div>
  );
}
