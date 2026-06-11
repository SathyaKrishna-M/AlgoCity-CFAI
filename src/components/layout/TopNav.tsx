import { Menu, Bell, Moon, Sun, Play, Pause, RotateCcw } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useCityEngine } from '../../stores/useCityEngine';
import { useLocation } from 'react-router-dom';

const routeNames: Record<string, string> = {
  '/': 'City Dashboard',
  '/traffic': 'Traffic Management Lab',
  '/dispatch': 'Emergency Dispatch Center',
  '/transport': 'Public Transport Network',
  '/logistics': 'Logistics & Delivery Hub',
  '/service': 'Citizen Service Center',
  '/records': 'City Records Database',
  '/planner': 'City Planner',
  '/analytics': 'Analytics Center',
  '/learn': 'Learning Hub',
  '/challenges': 'Challenge Mode',
};

export function TopNav() {
  const { toggleSidebar, theme, setTheme } = useUserStore();
  const engine = useCityEngine();
  const location = useLocation();
  const title = routeNames[location.pathname] || 'AlgoCity';

  return (
    <header className="h-16 flex items-center justify-between px-6 shrink-0 bg-[#0A0D14] border-b border-white/5">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-white/5 text-gray-400 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-white tracking-wide">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Global City Engine Controls */}
        <div className="flex items-center gap-3 bg-[#131B2A] px-4 py-1.5 rounded-xl border border-white/10 shadow-inner">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-none">City Time</span>
            <span className="text-sm font-mono font-bold text-[#D4AF37] leading-tight">Day {engine.day} - {engine.time}</span>
          </div>
          <button 
            onClick={engine.isCityRunning ? engine.pauseEngine : engine.startEngine}
            className={`p-1.5 rounded-full transition-colors ${engine.isCityRunning ? 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {engine.isCityRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={engine.resetEngine}
            className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-white/10"></div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-[#D4AF37]" />}
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full border border-[#0A0D14]"></span>
          </button>
          <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F59E0B] flex items-center justify-center text-[#111827] text-sm font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
