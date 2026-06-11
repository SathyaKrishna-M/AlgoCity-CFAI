import React from 'react';
import { Card, CardContent } from './Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function MetricCard({ title, value, icon, trend, trendUp }: MetricCardProps) {
  return (
    <Card className="overflow-hidden border border-white/5 bg-[#131B2A] shadow-lg relative group">
      <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
            </div>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">{title}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-white tracking-tight">{value}</h2>
          {trend && (
            <div className="text-xs font-medium flex items-center gap-1.5 mt-1">
              <span className={trendUp ? 'text-emerald-400' : 'text-red-400'}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
            </div>
          )}
        </div>

        {/* Sparkline Chart */}
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-50 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          {(() => {
            // Deterministic pseudo-random generation based on title length and char codes
            const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const getVal = (offset: number) => 30 - (((seed * offset) % 100) / 5);
            
            return (
              <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                <path 
                  d={`M0,${getVal(1)} L20,${getVal(2)} L40,${getVal(3)} L60,${getVal(4)} L80,${getVal(5)} L100,${getVal(6)}`}
                  fill="none" 
                  stroke="#D4AF37" 
                  strokeWidth="2"
                  className="drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]"
                />
                <path 
                  d={`M0,30 L0,${getVal(1)} L20,${getVal(2)} L40,${getVal(3)} L60,${getVal(4)} L80,${getVal(5)} L100,${getVal(6)} L100,30 Z`}
                  fill="url(#sparkline-gradient)" 
                  className="opacity-20"
                />
                <defs>
                  <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
}
