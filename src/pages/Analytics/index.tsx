import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Printer } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const executionTimeData = [
  { name: 'Small City (10)', BFS: 2, DFS: 1, Dijkstra: 5 },
  { name: 'Medium City (50)', BFS: 15, DFS: 8, Dijkstra: 35 },
  { name: 'Large City (200)', BFS: 80, DFS: 45, Dijkstra: 150 },
  { name: 'Mega City (1000)', BFS: 450, DFS: 250, Dijkstra: 980 },
];

const trafficAnalyticsData = [
  { time: '08:00', congestion: 45, incidents: 2 },
  { time: '09:00', congestion: 85, incidents: 5 },
  { time: '10:00', congestion: 65, incidents: 3 },
  { time: '11:00', congestion: 50, incidents: 1 },
  { time: '12:00', congestion: 70, incidents: 4 },
  { time: '13:00', congestion: 60, incidents: 2 },
];

export function Analytics() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-white tracking-tight">City Analytics & Benchmark Laboratory</h1>
          <p className="text-gray-400">Monitor live city metrics and benchmark algorithm scalability.</p>
        </div>
        <Button onClick={handlePrint} variant="outline" className="flex gap-2">
          <Printer className="w-4 h-4" /> Export Report (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Benchmark Lab */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Algorithm Scalability Benchmark (Execution Time ms vs Graph Size)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={executionTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#131B2A', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="BFS" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                <Bar dataKey="DFS" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Dijkstra" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Live Traffic Congestion Index</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficAnalyticsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip contentStyle={{ backgroundColor: '#131B2A', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }} />
                <Line type="monotone" dataKey="congestion" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emergency Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Incidents Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficAnalyticsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip contentStyle={{ backgroundColor: '#131B2A', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }} />
                <Line type="stepAfter" dataKey="incidents" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
