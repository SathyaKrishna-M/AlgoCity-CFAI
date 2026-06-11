import { motion, AnimatePresence } from 'framer-motion';
import { Ambulance, Flame, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MetricCard } from '../../components/ui/MetricCard';
import { useEmergencyStore } from '../../stores/useEmergencyStore';

import { CityMapEngine } from '../../components/map/CityMapEngine';
import { useTrafficStore } from '../../stores/useTrafficStore';
import { useSimulationStore } from '../../stores/useSimulationStore';
import { Graph } from '../../algorithms/graph/types';
import type { GraphState } from '../../algorithms/graph/types';
import { dijkstraGenerator } from '../../algorithms/graph/dijkstra';
import type { Incident } from '../../stores/useEmergencyStore';

export function DispatchCenter() {
  const { incidents, ambulancesAvailable, fireTrucksAvailable, policeCarsAvailable, dispatchIncident } = useEmergencyStore();
  const trafficStore = useTrafficStore();
  const simStore = useSimulationStore();

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const resolvedIncidents = incidents.filter(i => i.status === 'Resolved');

  const handleDispatch = (incident: Incident) => {
    dispatchIncident(incident.id);
    
    let startNode = 'c';
    if (incident.type === 'Medical') startNode = 'o_ne';
    if (incident.type === 'Fire') startNode = 'o_s';

    const graph = new Graph(trafficStore.nodes, trafficStore.edges);
    const generator = dijkstraGenerator(graph, startNode, incident.targetNode);
    
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
        <h1 className="text-3xl font-black text-white tracking-tight">Emergency Dispatch Center</h1>
        <p className="text-gray-400">Priority Queue Visualization and Resource Allocation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Ambulances Ready" value={ambulancesAvailable} icon={<Ambulance />} />
        <MetricCard title="Fire Trucks Ready" value={fireTrucksAvailable} icon={<Flame />} />
        <MetricCard title="Police Units Ready" value={policeCarsAvailable} icon={<ShieldAlert />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500 w-5 h-5" /> 
              Active Priority Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto bg-black/20 p-4 rounded-b-2xl border-t border-white/5">
            <div className="space-y-3">
              <AnimatePresence>
                {activeIncidents.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 py-10">
                    No active emergencies. The city is safe.
                  </motion.div>
                )}
                {activeIncidents.map((incident) => (
                  <motion.div
                    key={incident.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 shadow-sm rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm
                        ${incident.priority === 1 ? 'bg-gradient-to-br from-red-400 to-red-600' : 
                          incident.priority === 2 ? 'bg-gradient-gold' : 'bg-gradient-to-br from-blue-400 to-blue-600'}
                      `}>
                        P{incident.priority}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{incident.type} Emergency</h4>
                        <p className="text-sm text-gray-400">Location: {incident.location} • ID: {incident.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${incident.status === 'Dispatched' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                        {incident.status}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleDispatch(incident)} disabled={incident.status === 'Dispatched'}>Dispatch</Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500 w-5 h-5" />
              Recently Resolved
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
             <div className="space-y-3">
               {resolvedIncidents.length === 0 ? (
                 <p className="text-sm text-gray-400 text-center py-4">No recent resolutions.</p>
               ) : (
                 resolvedIncidents.map(inc => (
                   <div key={inc.id} className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex justify-between items-center">
                     <div>
                       <span className="font-semibold text-emerald-400 text-sm">{inc.type}</span>
                       <p className="text-xs text-emerald-500/70">{inc.location}</p>
                     </div>
                     <CheckCircle2 className="text-emerald-500 w-5 h-5 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   </div>
                 ))
               )}
             </div>
          </CardContent>
        </Card>

        {/* Cinematic Map Area */}
        <div className="col-span-1 lg:col-span-3 min-h-[400px] relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
          <CityMapEngine simState={graphState} />
        </div>
      </div>
    </div>
  );
}
