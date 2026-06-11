import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Flame, CloudRain, CarFront } from 'lucide-react';
import { useTrafficStore } from '../../stores/useTrafficStore';
import { useEmergencyStore } from '../../stores/useEmergencyStore';

export function DisasterControls() {
  const traffic = useTrafficStore();
  const emergency = useEmergencyStore();

  const handleFlood = () => {
    const edgesToClose = traffic.edges.filter(e => Math.random() > 0.7 && !e.isClosed);
    edgesToClose.forEach(e => traffic.closeRoad(e.id));
    emergency.addIncident({
      id: `FLD-${Date.now()}`,
      type: 'Medical',
      priority: 1,
      location: 'South Side',
      status: 'Pending',
      targetNode: 'o_s'
    });
  };

  const handleFire = () => {
    emergency.addIncident({
      id: `FIR-${Date.now()}`,
      type: 'Fire',
      priority: 1,
      location: 'Tech Park',
      status: 'Pending',
      targetNode: 'o_se'
    });
  };

  const handleAccident = () => {
    const randomEdge = traffic.edges[Math.floor(Math.random() * traffic.edges.length)];
    if (!randomEdge.isClosed) {
      traffic.closeRoad(randomEdge.id);
    }
    emergency.addIncident({
      id: `ACC-${Date.now()}`,
      type: 'Police',
      priority: 2,
      location: randomEdge.source,
      status: 'Pending',
      targetNode: randomEdge.source
    });
  };

  const handleResolveAll = () => {
    traffic.edges.forEach(e => {
      if (e.isClosed) traffic.openRoad(e.id);
    });
  };

  return (
    <Card className="border-white/5 bg-[#131B2A] shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-[#D4AF37] flex items-center gap-2">
          <Flame className="w-5 h-5 text-red-500" />
          Disaster Simulation Center
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button onClick={handleFlood} className="flex gap-2 bg-transparent border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
          <CloudRain className="w-4 h-4" /> Trigger Flood
        </Button>
        <Button onClick={handleFire} className="flex gap-2 bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
          <Flame className="w-4 h-4" /> Trigger Fire
        </Button>
        <Button onClick={handleAccident} className="flex gap-2 bg-transparent border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          <CarFront className="w-4 h-4" /> Major Accident
        </Button>
        
        <Button onClick={handleResolveAll} className="col-span-1 sm:col-span-3 mt-2 bg-transparent border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60">
          Resolve All Disasters (Open Roads)
        </Button>
      </CardContent>
    </Card>
  );
}
