import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GraphState, GraphEdge } from '../../algorithms/graph/types';

interface GraphCanvasProps {
  state: GraphState | null;
}

export const GraphCanvas = React.memo(function GraphCanvas({ state }: GraphCanvasProps) {
  if (!state) return <div className="flex items-center justify-center h-full text-gray-400">No simulation active. Configure and start an algorithm.</div>;

  const isPathFinalized = state.activePath && state.activePath.length > 1 && !state.frontier?.length;
  
  // Create coordinate sequence for the vehicle if path is finalized
  const vehiclePathCoords = isPathFinalized ? state.activePath.map(nodeId => {
    const node = state.nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : null;
  }).filter(Boolean) as { x: number, y: number }[] : [];

  const getEdgeColor = (edge: GraphEdge, isActive: boolean) => {
    if (isActive) return '#D4AF37'; // Gold
    if (edge.isClosed) return '#ef4444'; // Red
    if (edge.baseWeight && edge.weight) {
      const ratio = edge.weight / edge.baseWeight;
      if (ratio >= 2.0) return '#ef4444'; // red (severe congestion)
      if (ratio >= 1.5) return '#f59e0b'; // amber (heavy traffic)
    }
    return '#e2e8f0'; // normal soft slate
  };

  return (
    <div className="w-full h-full relative bg-gray-50 overflow-hidden rounded-xl border border-gray-100 shadow-inner">
      {/* SVG Canvas for Graph */}
      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#D4AF37" />
          </marker>
        </defs>
        
        {/* Edges */}
        <AnimatePresence>
          {state.edges.map(edge => {
            const source = state.nodes.find(n => n.id === edge.source);
            const target = state.nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;
            
            const isActive = !!state.activePath?.includes(edge.source) && !!state.activePath?.includes(edge.target);
            const edgeColor = getEdgeColor(edge, isActive);
            
            return (
              <g key={edge.id}>
                <motion.line
                  x1={source.x} y1={source.y}
                  x2={target.x} y2={target.y}
                  stroke={edgeColor}
                  strokeWidth={isActive ? 4 : 2}
                  strokeDasharray={edge.isClosed ? "4 4" : "none"}
                  markerEnd={edge.isDirected ? (isActive ? "url(#arrowhead-active)" : "url(#arrowhead)") : undefined}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, stroke: edgeColor }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
                {edge.weight !== undefined && (
                  <text 
                    x={(source.x + target.x) / 2} 
                    y={(source.y + target.y) / 2 - 10} 
                    className={`text-xs font-mono text-center select-none ${edge.isClosed ? 'fill-red-500' : 'fill-gray-500'}`}
                  >
                    {edge.isClosed ? 'X' : edge.weight}
                  </text>
                )}
              </g>
            );
          })}
        </AnimatePresence>

        {/* Nodes */}
        <AnimatePresence>
          {state.nodes.map(node => {
            const isVisited = state.visited.includes(node.id);
            const isFrontier = state.frontier.includes(node.id);
            const isActive = state.activePath?.includes(node.id);
            
            let bgColor = '#ffffff';
            let strokeColor = '#e2e8f0'; // slate-200
            let textColor = '#1e293b';
            
            if (isActive) {
              bgColor = '#FEF08A'; // Gold light
              strokeColor = '#D4AF37'; // Gold main
              textColor = '#713F12';
            } else if (isFrontier) {
              bgColor = '#FEF3C7'; // Amber light
              strokeColor = '#F59E0B'; // Amber main
              textColor = '#92400E';
            } else if (isVisited) {
              bgColor = '#D1FAE5'; // Emerald light
              strokeColor = '#10B981'; // Emerald main
              textColor = '#064E3B';
            }

            const distance = state.distances?.[node.id];

            return (
              <motion.g 
                key={node.id} 
                animate={{ x: node.x, y: node.y }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.circle
                  r={18}
                  fill={bgColor}
                  stroke={strokeColor}
                  strokeWidth={3}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, fill: bgColor, stroke: strokeColor }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <text x={0} y={5} textAnchor="middle" className="text-sm font-semibold pointer-events-none" fill={textColor}>
                  {node.id}
                </text>
                <text x={0} y={32} textAnchor="middle" className="text-xs fill-gray-500 font-medium pointer-events-none">
                  {node.label}
                </text>
                {distance !== undefined && (
                  <text x={0} y={-24} textAnchor="middle" className="text-[10px] fill-primary font-mono font-bold bg-white px-1 border border-gray-100 rounded">
                    {distance === Infinity ? '∞' : distance}
                  </text>
                )}
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>
      
      {/* Animated Vehicle (Only visible when path is finalized and has coords) */}
      {vehiclePathCoords.length > 1 && (
        <motion.div
          className="absolute w-6 h-6 -ml-3 -mt-3 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)] z-50 flex items-center justify-center border-2 border-white"
          initial={{ x: vehiclePathCoords[0].x, y: vehiclePathCoords[0].y }}
          animate={{
            x: vehiclePathCoords.map(p => p.x),
            y: vehiclePathCoords.map(p => p.y)
          }}
          transition={{
            duration: vehiclePathCoords.length * 0.8,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </motion.div>
      )}

      {/* Contextual Explainer Overlay (Shown when algorithm completes) */}
      {isPathFinalized && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          aria-live="polite"
          className="absolute top-4 right-4 max-w-sm bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-xl shadow-amber-900/10 border border-white/60"
        >
          <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Route Calculated
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            The algorithm has successfully found an optimal path. Total hops: <strong>{state.activePath.length - 1}</strong>.
          </p>
          <div className="text-xs bg-blue-50 p-2 rounded border border-blue-100 font-mono text-blue-800 break-words">
            {state.activePath.join(' → ')}
          </div>
        </motion.div>
      )}

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur p-3 rounded-xl border border-gray-200 shadow-sm text-xs flex flex-col gap-2 z-0">
        <div className="font-semibold text-gray-700 mb-1">Legend</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white border-2 border-gray-200"></div> Unvisited</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-200 border-2 border-yellow-600"></div> Frontier (Queue/PQ)</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-200 border-2 border-green-600"></div> Visited / Processed</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-200 border-2 border-blue-600"></div> Active / Path</div>
        <div className="mt-1 border-t border-gray-100 pt-2 flex items-center gap-4">
           <span className="text-gray-500">Traffic:</span>
           <span className="text-gray-400 font-bold border-b-2 border-gray-300">Normal</span>
           <span className="text-amber-500 font-bold border-b-2 border-amber-500">Heavy</span>
           <span className="text-red-500 font-bold border-b-2 border-red-500">Congested</span>
        </div>
      </div>
    </div>
  );
});
