import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Lightbulb, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { useTrafficStore } from '../../stores/useTrafficStore';
import { useEmergencyStore } from '../../stores/useEmergencyStore';

interface Recommendation {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  suggestion: string;
}

export function SmartAdvisorPanel() {
  const traffic = useTrafficStore();
  const emergency = useEmergencyStore();

  const getRecommendations = (): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Analyze Traffic
    const closedRoads = traffic.edges.filter(e => e.isClosed).length;
    const congestedRoads = traffic.edges.filter(e => !e.isClosed && (e.weight / (e.baseWeight || 1)) >= 2.0).length;
    
    if (closedRoads > 0) {
      recs.push({
        id: 'traffic-closed',
        type: 'critical',
        message: `${closedRoads} major routes are currently blocked.`,
        suggestion: `Consider dynamic rerouting using A* Algorithm to optimize traffic flow.`
      });
    } else if (congestedRoads >= 3) {
      recs.push({
        id: 'traffic-congested',
        type: 'warning',
        message: `Traffic congestion increasing in Central District.`,
        suggestion: `Consider dynamic rerouting using Dijkstra Algorithm to optimize traffic flow.`
      });
    }

    // Analyze Emergencies
    const pendingIncidents = emergency.incidents.filter(i => i.status === 'Pending').length;
    if (pendingIncidents >= 3) {
      recs.push({
        id: 'emergency-overload',
        type: 'critical',
        message: `Emergency response queue is overloading (${pendingIncidents} pending).`,
        suggestion: `Implement a Max Priority Queue to triage incidents by severity.`
      });
    }

    if (recs.length === 0) {
      recs.push({
        id: 'traffic-congested-default',
        type: 'warning',
        message: `Traffic congestion increasing in Central District.`,
        suggestion: `Consider dynamic rerouting using Dijkstra Algorithm to optimize traffic flow.`
      });
    }

    return recs;
  };

  const recommendations = getRecommendations();

  return (
    <Card className="border-white/5 bg-[#131B2A] shadow-lg flex flex-col">
      <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
            <Lightbulb className="w-4 h-4 text-[#D4AF37]" />
          </div>
          Smart City Advisor
        </CardTitle>
        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">AI</div>
      </CardHeader>
      <CardContent className="flex flex-col gap-0 p-0">
        <div className="p-4 border-b border-white/5 bg-[#D4AF37]/5">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <AlertTriangle className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#D4AF37]">{recommendations[0]?.message}</span>
              <span className="text-xs mt-1 text-gray-400">Recommended Action: {recommendations[0]?.suggestion}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-gray-500 group-hover:text-white" />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Monitor emergency response times in Zone A</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </div>
        
        <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Public transport usage is 18% higher than normal</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Logistics efficiency can be improved by 12%</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </div>
        
        <div className="p-3 text-center border-t border-white/5">
          <span className="text-xs text-[#D4AF37] font-semibold cursor-pointer hover:underline flex items-center justify-center gap-1">
            View All Recommendations <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
