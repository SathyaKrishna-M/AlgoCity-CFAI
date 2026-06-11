import { useState, useRef } from 'react';
import { useTrafficStore } from '../stores/useTrafficStore';
import type { Point } from '../stores/useTrafficStore';

type DragState = 
  | { type: 'none' }
  | { type: 'pan' }
  | { type: 'node', id: string }
  | { type: 'controlPoint', edgeId: string, pointIndex: number }
  | { type: 'newEdge', sourceId: string, currentX: number, currentY: number };

export function useGraphEditor(
  svgRef: React.RefObject<SVGSVGElement>, 
  viewBox: {x: number, y: number, w: number, h: number}, 
  setViewBox: React.Dispatch<React.SetStateAction<{x: number, y: number, w: number, h: number}>>
) {
  const isEditorMode = useTrafficStore(state => state.isEditorMode);
  const [dragState, setDragState] = useState<DragState>({ type: 'none' });
  
  // Use refs for instantaneous updates without waiting for React re-renders during high-freq pointer events
  const dragRef = useRef<DragState>({ type: 'none' });
  const lastPointer = useRef({ x: 0, y: 0 });

  const setDrag = (s: DragState) => {
    dragRef.current = s;
    setDragState(s);
  };

  const getSvgCoordinates = (clientX: number, clientY: number): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  const handleBackgroundPointerDown = (e: React.PointerEvent) => {
    const { addNode, setSelection } = useTrafficStore.getState();
    const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    
    if (isEditorMode) {
      if (e.shiftKey) {
        addNode(x, y);
      } else {
        setSelection(null);
        setDrag({ type: 'pan' });
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    } else {
      setDrag({ type: 'pan' });
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    if (!isEditorMode) return;
    
    const { setSelection } = useTrafficStore.getState();
    setSelection({ type: 'node', id: nodeId });
    
    if (e.shiftKey) {
      const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
      setDrag({ type: 'newEdge', sourceId: nodeId, currentX: x, currentY: y });
    } else {
      setDrag({ type: 'node', id: nodeId });
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleEdgePointerDown = (e: React.PointerEvent, edgeId: string) => {
    e.stopPropagation();
    if (!isEditorMode) return;
    
    const { setSelection, edges, updateEdgePoints } = useTrafficStore.getState();
    setSelection({ type: 'edge', id: edgeId });
    
    if (e.shiftKey) {
      const edge = edges.find(e => e.id === edgeId);
      if (edge) {
        const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
        const newPoints = [...edge.points, { x, y }];
        updateEdgePoints(edgeId, newPoints);
        setDrag({ type: 'controlPoint', edgeId, pointIndex: newPoints.length - 1 });
      }
    }
  };

  const handleControlPointPointerDown = (e: React.PointerEvent, edgeId: string, index: number) => {
    e.stopPropagation();
    if (!isEditorMode) return;
    
    const { edges, updateEdgePoints } = useTrafficStore.getState();
    
    if (e.altKey) {
      const edge = edges.find(e => e.id === edgeId);
      if (edge) {
        const newPoints = edge.points.filter((_, i) => i !== index);
        updateEdgePoints(edgeId, newPoints);
      }
    } else {
      setDrag({ type: 'controlPoint', edgeId, pointIndex: index });
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const currentDrag = dragRef.current;
    if (currentDrag.type === 'none') return;
    
    const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
    const { moveNode, edges, updateEdgePoints } = useTrafficStore.getState();

    if (currentDrag.type === 'pan') {
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      const scaleX = viewBox.w / (svgRef.current?.clientWidth || 1000);
      const scaleY = viewBox.h / (svgRef.current?.clientHeight || 800);

      setViewBox(prev => ({
        ...prev,
        x: prev.x - dx * scaleX,
        y: prev.y - dy * scaleY
      }));
    }
    
    else if (currentDrag.type === 'node') {
      moveNode(currentDrag.id, x, y);
    }
    
    else if (currentDrag.type === 'controlPoint') {
      const edge = edges.find(e => e.id === currentDrag.edgeId);
      if (edge) {
        const newPoints = [...edge.points];
        newPoints[currentDrag.pointIndex] = { x, y };
        updateEdgePoints(currentDrag.edgeId, newPoints);
      }
    }
    
    else if (currentDrag.type === 'newEdge') {
      setDrag({ ...currentDrag, currentX: x, currentY: y });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const currentDrag = dragRef.current;
    
    if (currentDrag.type === 'newEdge') {
      const { nodes, addEdge } = useTrafficStore.getState();
      const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
      const dropNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 20); // 20px snap radius
      if (dropNode && dropNode.id !== currentDrag.sourceId) {
        addEdge(currentDrag.sourceId, dropNode.id);
      }
    }
    
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDrag({ type: 'none' });
  };

  return {
    dragState,
    handleBackgroundPointerDown,
    handleNodePointerDown,
    handleEdgePointerDown,
    handleControlPointPointerDown,
    handlePointerMove,
    handlePointerUp
  };
}
