import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { MonitorPlay, CheckCircle2, Code2, Layers, Zap, Server, Database, Activity } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export function PresentationDashboard() {
  return (
    <div className="h-full flex flex-col space-y-10 max-w-6xl mx-auto pb-16 overflow-y-auto pr-4">
      <div className="text-center space-y-4 py-10">
        <h1 className="text-5xl font-black text-white tracking-tight">AlgoCity <span className="text-[#D4AF37]">Architecture & Showcase</span></h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          A high-performance educational laboratory demonstrating scalable state management, algorithmic decoupling, and real-time visualization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#131B2A] text-white border border-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/5">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Code2 className="w-10 h-10 text-blue-200 mb-2" />
            <div className="text-4xl font-black">5</div>
            <div className="text-sm text-blue-100 font-medium">Core Algorithms</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#131B2A] text-white border border-green-500/20 shadow-lg shadow-green-500/5">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Layers className="w-10 h-10 text-green-200 mb-2" />
            <div className="text-4xl font-black">10</div>
            <div className="text-sm text-green-100 font-medium">City Modules</div>
          </CardContent>
        </Card>

        <Card className="bg-[#131B2A] text-white border border-purple-500/20 shadow-lg shadow-purple-500/5">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <MonitorPlay className="w-10 h-10 text-purple-200 mb-2" />
            <div className="text-4xl font-black">100%</div>
            <div className="text-sm text-purple-100 font-medium">Visualized Execution</div>
          </CardContent>
        </Card>

        <Card className="bg-[#131B2A] text-white border border-amber-500/20 shadow-lg shadow-amber-500/5">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Zap className="w-10 h-10 text-amber-200 mb-2" />
            <div className="text-4xl font-black">&lt; 1ms</div>
            <div className="text-sm text-amber-100 font-medium">Generator Latency</div>
          </CardContent>
        </Card>
      </div>

      {/* --- Section: Architecture Components --- */}
      <div className="space-y-4 pt-4">
        <h2 className="text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-2">Core System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors shadow-sm bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Server className="w-6 h-6 text-[#D4AF37]" /> The Simulation Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 leading-relaxed mb-4">
                The engine operates on a continuous heartbeat (1000ms tick) utilizing <strong className="text-white">Zustand</strong> for atomic state management. Algorithms are implemented as TypeScript <strong className="text-white">Generators</strong> (<code className="bg-white/10 border border-white/20 px-1 py-0.5 rounded text-sm text-pink-400">function*</code>), ensuring that heavy pathfinding operations execute deterministically without blocking the main React UI thread, yielding snapshots of graph state (visited, frontier, path).
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Generator Pattern</Badge>
                <Badge variant="default">Zustand Stores</Badge>
                <Badge variant="default">Deterministic Replay</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors shadow-sm bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Activity className="w-6 h-6 text-green-500" /> Real-time Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 leading-relaxed mb-4">
                The visual layer relies on pure <strong className="text-white">SVG</strong> nodes mapped directly to the simulation state. We utilize <strong className="text-white">Framer Motion</strong> for spring-physics-based interpolation between steps. Traffic heatmaps are calculated dynamically using the ratio of current road weight to base weight.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">SVG Rendering</Badge>
                <Badge variant="success">Framer Motion</Badge>
                <Badge variant="success">Dynamic Heatmaps</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- Section: Concept Application --- */}
      <div className="space-y-4 pt-4">
         <h2 className="text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-2">Concepts Used & How</h2>
         <div className="grid grid-cols-1 gap-6">
            <Card className="bg-gradient-to-r from-[#131B2A] to-black/40 border border-white/10">
               <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-[#D4AF37] text-lg">Graph Theory</h4>
                        <p className="text-sm text-gray-400">The entire city layout is represented as a weighted, undirected Graph. Intersections are Nodes, and roads are Edges. Traffic congestion dynamically alters edge weights, actively influencing pathfinding operations like Dijkstra's.</p>
                     </div>
                     <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-emerald-400 text-lg">Binary Search Trees</h4>
                        <p className="text-sm text-gray-400">Citizen records are structured within a custom BST. This ensures that lookup queries scale logarithmically O(log N) rather than linearly, providing instant retrieval for millions of theoretical citizen records.</p>
                     </div>
                     <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-blue-400 text-lg">Priority Queues</h4>
                        <p className="text-sm text-gray-400">Emergency dispatch and logistics use a Min-Priority Queue to allocate resources efficiently. High-priority incidents preempt lower-priority tasks, mimicking real-world triage and dispatch operations.</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>

      {/* --- Section: Tech Stack & Implementations --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Features Implemented</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {['Dynamic Simulation Engine (Heartbeat Tick)', 'Disaster & Incident Injection', 'Algorithm Race Arena (Multi-execution)', 'City Map Sandbox Editor & JSON Export', 'Interactive Learning Academy', 'Progressive Web App (PWA) Support', 'Dijkstra / BFS / DFS Visualization', 'Real-Time SVG Animation'].map(feature => (
              <div key={feature} className="flex items-center gap-3 p-3 bg-white/5 rounded border border-white/10 text-sm font-medium text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                {feature}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#131B2A] text-white border-white/10 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <Database className="w-5 h-5 text-blue-400" /> Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-4 border border-white/5 rounded-xl bg-black/20">
                <div className="text-3xl font-black text-blue-400 mb-2">React 18</div>
                <div className="text-sm text-slate-400">UI Framework</div>
              </div>
              <div className="p-4 border border-white/5 rounded-xl bg-black/20">
                <div className="text-3xl font-black text-blue-500 mb-2">TS</div>
                <div className="text-sm text-slate-400">Strict TypeScript</div>
              </div>
              <div className="p-4 border border-white/5 rounded-xl bg-black/20">
                <div className="text-3xl font-black text-cyan-400 mb-2">Tailwind v4</div>
                <div className="text-sm text-slate-400">Utility CSS</div>
              </div>
              <div className="p-4 border border-white/5 rounded-xl bg-black/20">
                <div className="text-3xl font-black text-amber-400 mb-2">Zustand</div>
                <div className="text-sm text-slate-400">State Management</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
