import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCircle2, Timer, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MetricCard } from '../../components/ui/MetricCard';
import { useQueueStore } from '../../stores/useQueueStore';

export function ServiceCenter() {
  const { waitingLine, servingCounters } = useQueueStore();

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Citizen Service Center</h1>
        <p className="text-gray-400">First-In-First-Out (FIFO) Queue Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Waiting in Line" value={waitingLine.length} icon={<Users />} />
        <MetricCard title="Active Counters" value={servingCounters.filter(c => c.currentTicket).length} icon={<UserCircle2 />} />
        <MetricCard title="Avg Wait Time" value="14 min" icon={<Timer />} />
      </div>

      {/* Active Counters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {servingCounters.map(counter => (
          <Card key={counter.counterId} className="flex flex-col border-t-4 border-t-amber-500 bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Counter {counter.counterId}</CardTitle>
            </CardHeader>
            <CardContent>
              {counter.currentTicket ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center shadow-lg shadow-amber-900/20 text-white font-black text-2xl animate-pulse">
                    {counter.currentTicket.id}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white">{counter.currentTicket.serviceType}</p>
                    <p className="text-xs text-gray-400">Issued at {counter.currentTicket.issueTime}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">Complete Service</Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 space-y-2 text-gray-500">
                  <UserCircle2 className="w-12 h-12 text-white/10" />
                  <p className="text-sm font-medium">Available</p>
                  <Button variant="outline" size="sm" className="mt-2">Call Next</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FIFO Waiting Line */}
      <Card className="flex-1 min-h-[300px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>FIFO Waiting Line</span>
            <Button size="sm">Generate New Ticket</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 bg-black/20 rounded-b-2xl p-6 overflow-x-auto border-t border-white/5">
          <div className="flex items-center gap-4 min-w-max h-full">
            <div className="flex flex-col items-center justify-center px-4 border-r-2 border-dashed border-white/10 text-gray-500 h-full">
              <span className="text-sm font-bold tracking-widest uppercase mb-2">Counters</span>
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            <AnimatePresence>
              {waitingLine.map((ticket, i) => (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -50 }}
                  className={`flex flex-col items-center w-32 shrink-0 p-4 rounded-xl border shadow-sm
                    ${i === 0 ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-white/5 border-white/10'}
                    backdrop-blur-sm
                  `}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 shadow-sm
                    ${i === 0 ? 'bg-amber-500 text-amber-100' : 'bg-white/10 text-gray-400'}
                  `}>
                    {ticket.id}
                  </div>
                  <p className="text-xs font-bold text-center text-white line-clamp-1">{ticket.serviceType}</p>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Timer className="w-3 h-3" /> {ticket.issueTime}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <div className="flex-1 flex items-center justify-center px-8 text-gray-500 border-l-2 border-dashed border-white/10 h-full">
              <span className="text-sm font-bold tracking-widest uppercase">Entrance</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
