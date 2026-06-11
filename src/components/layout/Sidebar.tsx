import { NavLink } from 'react-router-dom';
import { Sun } from 'lucide-react';
import { 
  LayoutDashboard, 
  Map, 
  Ambulance, 
  Train, 
  Package, 
  Users, 
  Database, 
  Building2, 
  LineChart, 
  GraduationCap, 
  Trophy,
  BookOpen,
  MonitorPlay
} from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/traffic', icon: Map, label: 'Traffic Lab' },
  { to: '/dispatch', icon: Ambulance, label: 'Emergency Dispatch' },
  { to: '/transport', icon: Train, label: 'Transport Network' },
  { to: '/logistics', icon: Package, label: 'Logistics Hub' },
  { to: '/service', icon: Users, label: 'Citizen Services' },
  { to: '/records', icon: Database, label: 'Records Database' },
  { to: '/analytics', icon: LineChart, label: 'Analytics Center' },
  { to: '/learn', icon: GraduationCap, label: 'Learning Hub' },
  { to: '/challenges', icon: Trophy, label: 'Challenge Mode' },
  { to: '/presentation', icon: LayoutDashboard, label: 'Architecture & Presentation' },
];

export function Sidebar() {
  const { sidebarOpen } = useUserStore();

  return (
    <aside className={`bg-[#0F172A]/80 backdrop-blur-xl border border-white/5 flex flex-col transition-all duration-300 relative overflow-hidden ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNTAiIGZpbGw9Im5vbmUiPjxwb2x5Z29uIHBvaW50cz0iMCA1MCwgMCA0MCwgMTAgNDAsIDEwIDI1LCAyMCAyNSwgMjAgMTUsIDMwIDE1LCAzMCAzMCwgNDAgMzAsIDQwIDIwLCA1MCAyMCwgNTAgMzUsIDYwIDM1LCA2MCAxMCwgNzAgMTAsIDcwIDMwLCA4MCAzMCwgODAgMjUsIDkwIDI1LCA5MCA0MCwgMTAwIDQwLCAxMDAgNTAiIGZpbGw9IiNENEFGMzciLz48L3N2Zz4=')] bg-bottom bg-repeat-x shadow-[0_-20px_40px_rgba(212,175,55,0.1)]"></div>
      
      <div className="h-16 flex items-center justify-center border-b border-white/5 px-4 z-10">
        {sidebarOpen ? (
          <h1 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-gradient-gold rounded-xl shadow-sm text-white">
              <Building2 className="w-6 h-6" />
            </div>
            AlgoCity
          </h1>
        ) : (
          <div className="p-2 bg-gradient-gold rounded-xl shadow-sm text-white">
            <Building2 className="w-6 h-6" />
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3 z-10 scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-gradient-gold text-[#0A0D14] shadow-[0_0_15px_rgba(212,175,55,0.3)] font-semibold' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Bottom City Status Widget */}
      {sidebarOpen && (
        <div className="mt-auto p-4 z-10">
          <div className="bg-[#131B2A]/80 backdrop-blur-md rounded-xl p-4 border border-white/5 shadow-lg flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">City Status</span>
                <span className="text-sm font-bold text-emerald-500">Excellent</span>
              </div>
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" viewBox="0 0 36 36">
                  <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-emerald-500" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-white leading-none">92%</span>
                  <span className="text-[8px] text-gray-400 leading-none mt-0.5">Health</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-400 font-medium">City Time</span>
                <span className="text-gray-300">Day 1 • 08:00 AM</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-400 font-medium">Weather</span>
                <div className="flex items-center gap-1 text-gray-300">
                  <Sun className="w-3 h-3 text-[#D4AF37]" />
                  <span>24°C • Clear</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </aside>
  );
}
