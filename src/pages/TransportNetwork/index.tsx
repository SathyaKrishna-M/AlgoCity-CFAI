import { Train, Bus, Activity, Map as MapIcon, Route } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { useTransportStore } from '../../stores/useTransportStore';

export function TransportNetwork() {
  const { lines } = useTransportStore();

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Public Transport Network</h1>
        <p className="text-gray-400">Metro & Bus Route Planner and Live Tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Active Metros" value={lines.filter(l => l.type === 'Metro').length} icon={<Train />} />
        <MetricCard title="Active Buses" value={lines.filter(l => l.type === 'Bus').length} icon={<Bus />} />
        <MetricCard title="Network Status" value="Optimal" icon={<Activity />} />
        <MetricCard title="Avg Delay" value="2 min" icon={<MapIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="col-span-2 flex flex-col min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="w-5 h-5 text-amber-500" />
              Live Route Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 bg-black/20 rounded-b-2xl border-t border-white/5 p-6 flex flex-col gap-6">
            {lines.map((line) => {
              // Create a deterministic pseudo-random width based on line ID length
              const deterministicWidth = Math.max(20, (line.id.charCodeAt(0) * 10) % 80);
              
              return (
              <div key={line.id} className="relative flex items-center justify-between p-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl shadow-sm">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -z-10 -translate-y-1/2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${line.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'} animate-[shimmer_2s_infinite] opacity-50`} 
                    style={{ width: `${deterministicWidth}%` }}
                  ></div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-lg shadow-sm">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                    ${line.type === 'Metro' ? 'bg-gradient-gold' : 'bg-blue-500'}
                  `}>
                    {line.type === 'Metro' ? <Train className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{line.name}</h4>
                    <p className="text-xs text-gray-400">ID: {line.id}</p>
                  </div>
                </div>

                <div className="bg-white/5 px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${line.status === 'Active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]' : 'bg-amber-500 shadow-[0_0_8px_#F59E0B]'}`}></div>
                  {line.status}
                </div>
              </div>
            )})}
          </CardContent>
        </Card>

        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Network Alerts</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            {lines.filter(l => l.status !== 'Active').length === 0 ? (
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" /> All lines are running on schedule.
              </div>
            ) : (
              lines.filter(l => l.status !== 'Active').map(line => (
                <div key={line.id} className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <h5 className="font-bold text-amber-400 text-sm">{line.name} ({line.type})</h5>
                  <p className="text-xs text-amber-500/70 mt-1">Experiencing minor delays due to heavy traffic. Adjusting schedule.</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
