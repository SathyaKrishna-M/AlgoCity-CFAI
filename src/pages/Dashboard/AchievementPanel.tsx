import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useAchievementStore } from '../../stores/useAchievementStore';
import { Car, Shield, Package, Building, Brain } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  car: <Car className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  package: <Package className="w-5 h-5" />,
  building: <Building className="w-5 h-5" />,
  brain: <Brain className="w-5 h-5" />
};

export function AchievementPanel() {
  const { achievements, getUnlockedCount } = useAchievementStore();
  const unlocked = getUnlockedCount();

  return (
    <Card className="border-white/5 bg-[#131B2A] shadow-lg flex flex-col">
      <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          Achievements ({unlocked}/{achievements.length})
        </CardTitle>
        <span className="text-xs text-[#D4AF37] font-semibold cursor-pointer hover:underline">View All</span>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-0 p-0 flex-1">
        {achievements.map((ach, idx) => (
          <div key={ach.id} className={`flex flex-col p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${idx === achievements.length - 1 ? 'border-b-0' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg border ${ach.unlocked ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                {iconMap[ach.icon]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-200">{ach.title}</h4>
                  <span className="text-xs font-mono font-medium text-gray-400">
                    {ach.progress} / {ach.maxProgress}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{ach.description}</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-gold rounded-full shadow-[0_0_5px_rgba(212,175,55,0.8)]"
                    style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
