import { cloneElement } from 'react';
import type { ReactElement } from 'react';
import { Users, Map as MapIcon, Car, Building2, Package, AlertTriangle, Play, Settings2, Wifi } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';
import { useTrafficStore } from '../../stores/useTrafficStore';
import { CityMapEngine } from '../../components/map/CityMapEngine';
import { GraphEditorPanel } from '../../components/map/GraphEditorPanel';

export function Dashboard() {
  const cityState = useCityStore();
  const { isEditorMode } = useTrafficStore();

  if (!cityState.vehicles) {
    return (
      <div className="w-full h-full p-12 flex flex-col items-center justify-center bg-[#131B2A] text-gray-400">
        <AlertTriangle className="w-12 h-12 mb-4 text-[#D4AF37] opacity-80" />
        <h3 className="text-lg font-bold text-white">City is Offline</h3>
        <p className="text-sm text-center max-w-sm mt-2 opacity-70">The simulation engine has not started. Please initiate the global engine from the top navigation bar to begin receiving telemetry.</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-[calc(100vh-4rem)] overflow-hidden bg-[#0A0D14]">
      {/* Absolute Full Screen Map */}
      <CityMapEngine />

      <GraphEditorPanel />

      {/* Top Floating KPI Cards */}
      <div className={`absolute top-6 left-6 right-6 z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pointer-events-none transition-opacity duration-300 ${isEditorMode ? 'opacity-0' : 'opacity-100'}`}>
        <KpiCard title="Population" value="1,420,500" icon={<Users />} trend="1.26% from yesterday" trendColor="text-emerald-400" />
        <KpiCard title="Active Roads" value="432" icon={<MapIcon />} trend="8 new roads" trendColor="text-emerald-400" />
        <KpiCard title="Emergency Requests" value="12" icon={<AlertTriangle />} trend="3 resolved" trendColor="text-red-500" sparkline="red" />
        <KpiCard title="Vehicles Online" value="8,540" icon={<Car />} trend="92% in operation" trendColor="text-emerald-400" />
        <KpiCard title="Service Centers" value="5" icon={<Building2 />} trend="All systems operational" trendColor="text-gray-400" />
        <KpiCard title="Deliveries Today" value="154" icon={<Package />} trend="15 completed" trendColor="text-emerald-400" />
      </div>

      {/* Right Side Floating Panels */}
      <div className={`absolute top-32 right-6 z-10 w-72 flex flex-col gap-4 pointer-events-none transition-opacity duration-300 ${isEditorMode ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Route Information Panel */}
        <div className="bg-[#131B2A]/90 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2"><Settings2 className="w-4 h-4 text-[#D4AF37]"/> Route Information</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div> Optimal Route
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Distance</span>
              <span className="text-white font-bold">12.8 km</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Est. Time</span>
              <span className="text-white font-bold">24 min</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Traffic Condition</span>
              <span className="text-[#D4AF37] font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div> Moderate</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Toll Cost</span>
              <span className="text-white font-bold">$2.50</span>
            </div>

            <button className="mt-2 w-full py-2.5 rounded-lg bg-gradient-gold text-[#0A0D14] font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Play className="w-4 h-4 fill-current" /> Start Simulation
            </button>
          </div>
        </div>

        {/* Map Layers Panel */}
        <div className="bg-[#131B2A]/90 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2"><MapIcon className="w-4 h-4 text-emerald-500"/> Map Layers</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <LayerToggle label="Road Network" active={true} />
            <LayerToggle label="Traffic Flow" active={true} />
            <LayerToggle label="Incidents" active={true} />
            <LayerToggle label="Transport" active={true} />
            <LayerToggle label="Service Centers" active={true} />
            <LayerToggle label="Buildings" active={false} />
          </div>
        </div>

        {/* Live Integration Pill */}
        <div className="ml-auto mt-2 bg-[#131B2A]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg pointer-events-auto">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
          <span className="text-xs font-bold text-white">Live Maps Integration</span>
        </div>
      </div>

      {/* Bottom Center Route / Telemetry */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 pointer-events-none transition-opacity duration-300 ${isEditorMode ? 'opacity-0' : 'opacity-100'}`}>
        
        <div className="bg-[#131B2A]/90 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 shadow-2xl flex items-center gap-6 pointer-events-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">From</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-bold text-white">One World Trade Center</span>
            </div>
          </div>
          
          <div className="text-gray-500">→</div>
          
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">To</span>
            <div className="flex items-center gap-2">
              <MapIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-sm font-bold text-white">Central Park</span>
            </div>
          </div>
        </div>

        <div className="bg-[#131B2A]/90 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 pointer-events-auto">
          <Wifi className="w-5 h-5 text-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-tight">Live City Telemetry</span>
            <span className="text-[10px] text-gray-400 font-medium">Updated 2s ago</span>
          </div>
        </div>

      </div>

      {/* Bottom Left Traffic Density Legend */}
      <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
        <div className="bg-[#131B2A]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl w-48 pointer-events-auto">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 block">Traffic Density</span>
          <div className="flex flex-col gap-2.5">
            <LegendRow color="bg-emerald-500" label="Low" />
            <LegendRow color="bg-[#D4AF37]" label="Moderate" />
            <LegendRow color="bg-orange-500" label="High" />
            <LegendRow color="bg-red-500" label="Severe" />
          </div>
        </div>
      </div>

    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  icon: ReactElement;
  trend: string;
  trendColor: string;
  sparkline?: 'green' | 'red';
}

function KpiCard({ title, value, icon, trend, trendColor, sparkline = "green" }: KpiCardProps) {
  return (
    <div className="bg-[#131B2A]/80 backdrop-blur-md rounded-xl p-4 border border-white/5 shadow-lg relative overflow-hidden pointer-events-auto hover:bg-[#131B2A]/90 transition-colors">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="text-[#D4AF37]">{cloneElement(icon as ReactElement<any>, { className: 'w-4 h-4' })}</div>
          <h3 className="text-xs font-bold text-gray-300 tracking-wide">{title}</h3>
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-2xl font-black text-white tracking-tight mb-1">{value}</div>
        <div className={`text-[10px] font-bold ${trendColor}`}>{trend}</div>
      </div>
      
      {/* Decorative Sparkline */}
      <div className="absolute bottom-0 left-0 right-0 h-8 opacity-40">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
          <path 
            d={sparkline === 'green' ? "M0,20 L10,15 L20,18 L30,10 L40,12 L50,5 L60,8 L70,2 L80,6 L90,0 L100,4" : "M0,5 L10,8 L20,4 L30,12 L40,10 L50,15 L60,12 L70,18 L80,14 L90,20 L100,16"} 
            fill="none" 
            stroke={sparkline === 'green' ? "#10B981" : "#EF4444"} 
            strokeWidth="1.5" 
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}

function LayerToggle({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between cursor-pointer group">
      <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">{label}</span>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-emerald-500' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-[18px] shadow-sm' : 'left-0.5'}`}></div>
      </div>
    </div>
  );
}

function LegendRow({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-1.5 rounded-full ${color}`}></div>
      <span className="text-xs font-semibold text-gray-300">{label}</span>
    </div>
  );
}
