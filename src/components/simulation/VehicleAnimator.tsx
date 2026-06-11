import { useEffect, useRef, useMemo } from 'react';
import { useSimulationStore } from '../../stores/useSimulationStore';
import { useTrafficStore } from '../../stores/useTrafficStore';
import type { Point } from '../../stores/useTrafficStore';
import { Car } from 'lucide-react';

interface VehicleAnimatorProps {
  pathNodes: string[];
}

export function VehicleAnimator({ pathNodes }: VehicleAnimatorProps) {
  const { nodes, edges } = useTrafficStore();
  const isPlaying = useSimulationStore(state => state.isPlaying);
  const speedMultiplier = useSimulationStore(state => state.speedMultiplier);
  
  const vehicleRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef(0);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Generate a continuous SVG path string for the exact route sequence
  const combinedPathD = useMemo(() => {
    if (pathNodes.length < 2) return '';
    let d = '';

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const sourceId = pathNodes[i];
      const targetId = pathNodes[i+1];
      
      const edge = edges.find(e => 
        (e.source === sourceId && e.target === targetId) || 
        (!e.isDirected && e.target === sourceId && e.source === targetId)
      );

      if (!edge) continue;

      const n1 = nodes.find(n => n.id === sourceId);
      const n2 = nodes.find(n => n.id === targetId);
      if (!n1 || !n2) continue;

      const isReversed = edge.source !== sourceId;
      
      // Get points in traversal order
      let segmentPoints: Point[] = [];
      if (edge.points && edge.points.length > 0) {
        segmentPoints = [...edge.points];
        if (isReversed) segmentPoints.reverse();
      }

      const allPoints = [n1, ...segmentPoints, n2];

      if (i === 0) {
        d += `M ${allPoints[0].x} ${allPoints[0].y}`;
      }

      if (allPoints.length === 2) {
        d += ` L ${allPoints[1].x} ${allPoints[1].y}`;
      } else if (allPoints.length === 3) {
        d += ` Q ${allPoints[1].x} ${allPoints[1].y}, ${allPoints[2].x} ${allPoints[2].y}`;
      } else {
        for (let j = 1; j < allPoints.length - 2; j++) {
          const xc = (allPoints[j].x + allPoints[j + 1].x) / 2;
          const yc = (allPoints[j].y + allPoints[j + 1].y) / 2;
          d += ` Q ${allPoints[j].x} ${allPoints[j].y}, ${xc} ${yc}`;
        }
        const lastCtrl = allPoints[allPoints.length - 2];
        const lastPt = allPoints[allPoints.length - 1];
        d += ` Q ${lastCtrl.x} ${lastCtrl.y}, ${lastPt.x} ${lastPt.y}`;
      }
    }
    return d;
  }, [pathNodes, nodes, edges]);

  useEffect(() => {
    // Reset progress when path changes
    progressRef.current = 0;
  }, [combinedPathD]);

  useEffect(() => {
    if (!pathRef.current || !vehicleRef.current) return;
    
    const pathEl = pathRef.current;
    const totalLength = pathEl.getTotalLength();
    if (totalLength === 0) return;

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (isPlaying) {
        // Base speed: 100 pixels per second, multiplied by sim speed
        const pixelsPerMs = (150 * speedMultiplier) / 1000;
        progressRef.current += pixelsPerMs * dt;

        if (progressRef.current >= totalLength) {
          progressRef.current = 0; // Loop the animation
        }

        // Native SVG getPointAtLength
        const point = pathEl.getPointAtLength(progressRef.current);
        
        // Calculate rotation using next point slightly ahead
        const nextPoint = pathEl.getPointAtLength(Math.min(progressRef.current + 2, totalLength));
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

        if (vehicleRef.current) {
          vehicleRef.current.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${angle})`);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, speedMultiplier, combinedPathD]);

  if (!combinedPathD) return null;

  return (
    <g id="vehicle-animator">
      {/* Invisible path for length calculations */}
      <path 
        ref={pathRef}
        d={combinedPathD} 
        fill="none" 
        stroke="none" 
      />
      
      {/* Glowing Route Trace underneath the vehicle */}
      <path 
        d={combinedPathD} 
        fill="none" 
        stroke="#FCD34D" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="opacity-60 drop-shadow-[0_0_10px_rgba(252,211,77,0.8)] animate-pulse"
      />

      {/* The animated vehicle */}
      <g ref={vehicleRef} style={{ willChange: 'transform' }}>
        <circle cx="0" cy="0" r="12" fill="#D4AF37" className="drop-shadow-[0_0_15px_rgba(212,175,55,1)]" />
        <foreignObject x="-10" y="-10" width="20" height="20">
          <div className="w-full h-full flex items-center justify-center text-[#131B2A]">
            <Car className="w-3.5 h-3.5" />
          </div>
        </foreignObject>
      </g>
    </g>
  );
}
