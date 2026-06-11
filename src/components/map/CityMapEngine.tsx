import {} from 'react';
import React, { useRef, useState } from 'react';
import type { GraphState } from '../../algorithms/graph/types';
import { VehicleAnimator } from '../simulation/VehicleAnimator';
import { useTrafficStore } from '../../stores/useTrafficStore';
import type { TrafficEdge } from '../../stores/useTrafficStore';
import { Building2, AlertTriangle, Package as PackageIcon, Train } from 'lucide-react';
import mapBg from '../../assets/map.png';
import { useGraphEditor } from '../../hooks/useGraphEditor';

export function CityMapEngine({ simState }: { simState?: GraphState | null }) {
  const { nodes, edges, isEditorMode, selection } = useTrafficStore();
  const svgRef = useRef<SVGSVGElement>(null as unknown as SVGSVGElement);

  // Pan and Zoom State
  const [viewBox, setViewBox] = useState({ x: -100, y: -50, w: 1200, h: 900 });

  const {
    dragState,
    handleBackgroundPointerDown,
    handleNodePointerDown,
    handleEdgePointerDown,
    handleControlPointPointerDown,
    handlePointerMove,
    handlePointerUp
  } = useGraphEditor(svgRef, viewBox, setViewBox);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const zoomFactor = 1 + (e.deltaY * zoomSensitivity);
    
    setViewBox(prev => {
      const newW = Math.max(300, Math.min(3000, prev.w * zoomFactor));
      const newH = Math.max(200, Math.min(2000, prev.h * zoomFactor));
      const dw = newW - prev.w;
      const dh = newH - prev.h;
      return { x: prev.x - dw / 2, y: prev.y - dh / 2, w: newW, h: newH };
    });
  };

  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'hospital': return <AlertTriangle className="w-3.5 h-3.5 text-white" />;
      case 'hub': return <Building2 className="w-4 h-4 text-[#D4AF37]" />;
      case 'commercial': return <Building2 className="w-3.5 h-3.5 text-white" />;
      case 'transport': return <Train className="w-3.5 h-3.5 text-white" />;
      case 'logistics': return <PackageIcon className="w-3.5 h-3.5 text-white" />;
      default: return null;
    }
  };

  const getNodeColor = (type: string) => {
    switch(type) {
      case 'hospital': return 'fill-red-500';
      case 'hub': return 'fill-emerald-500';
      case 'commercial': return 'fill-blue-500';
      case 'transport': return 'fill-purple-500';
      case 'logistics': return 'fill-orange-500';
      default: return 'fill-gray-600';
    }
  };

  const getEdgePath = (edge: TrafficEdge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return '';
    
    if (edge.points && edge.points.length > 0) {
      let d = `M ${sourceNode.x} ${sourceNode.y}`;
      const allPoints = [sourceNode, ...edge.points, targetNode];
      
      if (allPoints.length === 3) {
        // One control point -> simple quadratic curve
        d += ` Q ${allPoints[1].x} ${allPoints[1].y}, ${allPoints[2].x} ${allPoints[2].y}`;
      } else {
        // Smooth multi-point curve
        for (let i = 1; i < allPoints.length - 2; i++) {
          const xc = (allPoints[i].x + allPoints[i + 1].x) / 2;
          const yc = (allPoints[i].y + allPoints[i + 1].y) / 2;
          d += ` Q ${allPoints[i].x} ${allPoints[i].y}, ${xc} ${yc}`;
        }
        // Last point
        const lastCtrl = allPoints[allPoints.length - 2];
        const lastPt = allPoints[allPoints.length - 1];
        d += ` Q ${lastCtrl.x} ${lastCtrl.y}, ${lastPt.x} ${lastPt.y}`;
      }
      return d;
    }
    
    return `M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`;
  };

  const isEdgeActive = (edge: TrafficEdge) => {
    if (!simState?.activePath || simState.activePath.length < 2) return false;
    const path = simState.activePath;
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === edge.source && path[i+1] === edge.target) || 
          (!edge.isDirected && path[i] === edge.target && path[i+1] === edge.source)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div 
      className={`absolute inset-0 w-full h-full bg-[#0a0d14] overflow-hidden ${isEditorMode ? 'cursor-crosshair' : 'cursor-grab'}`}
      onWheel={handleWheel}
      onPointerDown={handleBackgroundPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg 
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      >
        <defs>
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="editorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* --- LAYER 1: BACKGROUND --- */}
        <g id="layer-1-bg">
          <image 
            href={mapBg} 
            x="-100" 
            y="-50" 
            width="1200" 
            height="900" 
            preserveAspectRatio="xMidYMid slice" 
            className={`opacity-70 transition-all duration-500 ${isEditorMode ? 'saturate-50 brightness-50' : 'saturate-150 brightness-90'}`}
          />
        </g>

        {/* --- LAYER 2: ROAD EDGES --- */}
        <g id="layer-2-roads">
          {edges.map(edge => {
            const d = getEdgePath(edge);
            const isSelected = selection?.type === 'edge' && selection.id === edge.id;
            
            // Determine traffic color
            let strokeColor = '#10B981'; // Green
            const ratio = edge.weight / edge.baseWeight;
            if (edge.isClosed) strokeColor = '#EF4444';
            else if (ratio > 2) strokeColor = '#F97316';
            else if (ratio > 1.2) strokeColor = '#D4AF37';

            const isActiveEdge = isEdgeActive(edge);

            if (isEditorMode) {
              strokeColor = isSelected ? '#3B82F6' : '#94A3B8';
            } else if (simState && isActiveEdge) {
              strokeColor = '#FCD34D'; // Yellow glow for active algorithm path
            }

            return (
              <g key={edge.id} className={isEditorMode ? "cursor-pointer" : ""}>
                {/* Hit box for easier clicking */}
                {isEditorMode && (
                  <path
                    d={d}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="20"
                    onPointerDown={(e) => handleEdgePointerDown(e, edge.id)}
                  />
                )}
                <path 
                  d={d} 
                  fill="none" 
                  stroke={strokeColor} 
                  strokeWidth={edge.isClosed && !isEditorMode ? 6 : (isSelected || isActiveEdge ? 5 : 4)} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  strokeDasharray={edge.isClosed && !isEditorMode ? "8,12" : "none"}
                  filter={(!isEditorMode && (ratio > 1.2 || edge.isClosed || isActiveEdge)) ? "url(#neonGlow)" : (isSelected ? "url(#editorGlow)" : "")}
                  className="opacity-90 transition-all duration-300"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Control Points (only when selected in editor) */}
                {isEditorMode && isSelected && edge.points.map((p, i) => (
                  <g 
                    key={i} 
                    transform={`translate(${p.x}, ${p.y})`} 
                    className="cursor-move hover:scale-150 transition-transform" 
                    onPointerDown={(e) => handleControlPointPointerDown(e, edge.id, i)}
                  >
                    <circle cx="0" cy="0" r="15" fill="transparent" />
                    <circle
                      cx="0"
                      cy="0"
                      r="5"
                      fill="#3B82F6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </g>
                ))}
              </g>
            );
          })}

          {/* New Edge being drawn */}
          {dragState.type === 'newEdge' && (
            <path
              d={`M ${nodes.find(n => n.id === dragState.sourceId)?.x || 0} ${nodes.find(n => n.id === dragState.sourceId)?.y || 0} L ${dragState.currentX} ${dragState.currentY}`}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="opacity-50"
            />
          )}
        </g>

        {/* --- LAYER 3 & 4: NODES & LANDMARKS --- */}
        <g id="layer-3-nodes">
          {nodes.map(node => {
            const isSelected = selection?.type === 'node' && selection.id === node.id;
            
            const isVisited = simState?.visited?.includes(node.id);
            const isFrontier = simState?.frontier?.includes(node.id);
            const isActive = simState?.activePath?.includes(node.id);
            const distance = simState?.distances?.[node.id];

            let simColor = null;
            if (!isEditorMode && simState) {
              if (isActive) simColor = '#FEF08A';
              else if (isFrontier) simColor = '#FEF3C7';
              else if (isVisited) simColor = '#D1FAE5';
            }
            
            if (node.type === 'intersection') {
              // Standard intersections
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  className={isEditorMode ? 'cursor-pointer hover:scale-125 transition-transform' : ''}
                  onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                >
                  {isEditorMode && <circle cx="0" cy="0" r="15" fill="transparent" />}
                  <circle 
                    cx="0" 
                    cy="0" 
                    r={isEditorMode ? (isSelected ? 6 : 5) : 3} 
                    fill={simColor || (isEditorMode && isSelected ? "#3B82F6" : "#ffffff")} 
                    stroke={isEditorMode ? "#000" : (simColor ? "#000" : "none")}
                    strokeWidth={simColor ? "1" : "2"}
                    className="opacity-80 shadow-md transition-colors duration-300" 
                  />
                  {distance !== undefined && !isEditorMode && (
                    <text y="-10" textAnchor="middle" className="text-[9px] fill-[#FCD34D] font-mono font-bold" style={{ pointerEvents: 'none' }}>
                      {distance === Infinity ? '∞' : distance}
                    </text>
                  )}
                </g>
              );
            }

            // Major nodes get the full marker treatment
            return (
              <g 
                key={node.id} 
                transform={`translate(${node.x}, ${node.y})`}
                className={isEditorMode ? 'cursor-pointer' : ''}
                onPointerDown={(e) => handleNodePointerDown(e, node.id)}
              >
                <rect x="-14" y="-14" width="28" height="28" rx="14" className={getNodeColor(node.type)} filter={isSelected ? "url(#editorGlow)" : (!isEditorMode ? "url(#neonGlow)" : "")} opacity={isEditorMode && !isSelected ? "0.2" : "0.4"} />
                <rect x="-12" y="-12" width="24" height="24" rx="12" fill="#0a0d14" stroke={isSelected ? "#3B82F6" : "rgba(255,255,255,0.4)"} strokeWidth={isSelected ? 2 : 1.5} />
                <foreignObject x="-10" y="-10" width="20" height="20" style={{ pointerEvents: 'none' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    {getNodeIcon(node.type)}
                  </div>
                </foreignObject>
                <text 
                  y="24" 
                  textAnchor="middle" 
                  className={`text-[11px] font-black select-none drop-shadow-[0_2px_2px_rgba(0,0,0,1)] ${isSelected ? 'fill-[#3B82F6]' : 'fill-white'}`}
                  style={{ paintOrder: 'stroke', stroke: '#0a0d14', strokeWidth: 4, pointerEvents: 'none' }}
                >
                  {node.label}
                </text>
                {distance !== undefined && !isEditorMode && (
                  <text y="-20" textAnchor="middle" className="text-[11px] fill-[#FCD34D] font-mono font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,1)]" style={{ pointerEvents: 'none' }}>
                    dist: {distance === Infinity ? '∞' : distance}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* --- LAYER 5: SIMULATION --- */}
        {!isEditorMode && simState?.activePath && simState.activePath.length > 1 && !simState.frontier?.length && (
          <g id="layer-5-simulation">
            <VehicleAnimator pathNodes={simState.activePath} />
          </g>
        )}

      </svg>
    </div>
  );
}
