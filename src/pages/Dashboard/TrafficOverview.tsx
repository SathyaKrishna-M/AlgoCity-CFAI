import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
  { time: '00:00', flow: 10, density: 15, incidents: 5 },
  { time: '04:00', flow: 20, density: 30, incidents: 8 },
  { time: '08:00', flow: 60, density: 75, incidents: 25 },
  { time: '12:00', flow: 45, density: 50, incidents: 15 },
  { time: '16:00', flow: 55, density: 65, incidents: 20 },
  { time: '20:00', flow: 80, density: 90, incidents: 35 },
  { time: '24:00', flow: 30, density: 40, incidents: 10 },
];

export function TrafficOverview() {
  return (
    <Card className="border-white/5 bg-[#131B2A] shadow-lg flex flex-col h-full">
      <CardHeader className="pb-0 flex flex-row items-center justify-between border-b border-white/5 px-4 py-3">
        <CardTitle className="text-white text-base">Traffic Overview</CardTitle>
        <div className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10">
          Today <ChevronDown className="w-3 h-3" />
        </div>
      </CardHeader>
      
      <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div> Flow</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_5px_rgba(212,175,55,0.8)]"></div> Density</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div> Incidents</div>
      </div>

      <CardContent className="flex-1 p-4 flex flex-col justify-between">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#F8FAFC', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="flow" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" />
              <Area type="monotone" dataKey="density" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorDensity)" />
              <Area type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorIncidents)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Avg Speed</span>
            <span className="text-xl font-bold text-white">32 km/h</span>
            <span className="text-xs text-emerald-400 mt-0.5">↑ 6%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Congestion</span>
            <span className="text-xl font-bold text-white">68%</span>
            <span className="text-xs text-red-400 mt-0.5">↑ 12%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Incidents</span>
            <span className="text-xl font-bold text-white">11</span>
            <span className="text-xs text-emerald-400 mt-0.5">↓ 2%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
