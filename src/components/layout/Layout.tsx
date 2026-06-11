import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

import { useLocation } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0D14] text-gray-300">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 bg-[#0A0D14] overflow-hidden">
        <TopNav />
        <main className={`flex-1 overflow-y-auto ${isDashboard ? 'p-0 relative' : 'p-6 lg:p-8'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
