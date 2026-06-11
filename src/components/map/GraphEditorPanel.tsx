import {} from 'react';
import React, { useRef } from 'react';
import { useTrafficStore } from '../../stores/useTrafficStore';
import type { NodeType } from '../../stores/useTrafficStore';
import { Settings2, Save, Upload, Trash2, MousePointer2 } from 'lucide-react';

export function GraphEditorPanel() {
  const { isEditorMode, toggleEditorMode, selection, nodes, edges, updateNode, updateEdgeWeight, deleteNode, deleteEdge, loadGraph } = useTrafficStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'city-graph.json';
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.nodes && data.edges) {
          loadGraph(data.nodes, data.edges);
        }
      } catch (err) {
        console.error('Failed to parse graph JSON', err);
      }
    };
    reader.readAsText(file);
  };

  if (!isEditorMode) {
    return (
      <button 
        onClick={toggleEditorMode}
        className="absolute bottom-6 right-6 z-20 bg-[#131B2A]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-xl hover:bg-[#1a2537] transition-colors pointer-events-auto text-white text-sm font-bold"
      >
        <Settings2 className="w-4 h-4 text-[#D4AF37]" />
        Sandbox Editor
      </button>
    );
  }

  const selectedNode = selection?.type === 'node' ? nodes.find(n => n.id === selection.id) : null;
  const selectedEdge = selection?.type === 'edge' ? edges.find(e => e.id === selection.id) : null;

  return (
    <div className="absolute top-6 right-6 bottom-6 w-80 z-20 flex flex-col gap-4 pointer-events-none">
      <div className="bg-[#131B2A]/95 backdrop-blur-md rounded-xl border border-[#3B82F6]/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden pointer-events-auto flex flex-col h-full">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-[#0a0d14]/50">
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <MousePointer2 className="w-4 h-4 text-[#3B82F6]"/> 
            Graph Editor
          </span>
          <button onClick={toggleEditorMode} className="text-xs text-gray-400 hover:text-white transition-colors">Exit</button>
        </div>
        
        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
          <div className="text-[11px] text-gray-300 bg-black/30 p-3 rounded-lg border border-white/5">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Drag background:</strong> Pan map</li>
              <li><strong>Shift + Click bg:</strong> Add Node</li>
              <li><strong>Shift + Drag Node:</strong> Add Edge</li>
              <li><strong>Shift + Click Edge:</strong> Add Curve Point</li>
              <li><strong>Alt + Click Point:</strong> Delete Point</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <button onClick={handleExport} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-white transition-colors">
              <Save className="w-3.5 h-3.5" /> Save JSON
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-white transition-colors">
              <Upload className="w-3.5 h-3.5" /> Load JSON
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
          </div>

          <hr className="border-white/5 my-2" />

          {selectedNode && (
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">Selected Node</h4>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Label</label>
                <input 
                  type="text" 
                  value={selectedNode.label}
                  onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
                  className="bg-black/30 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Type</label>
                <select 
                  value={selectedNode.type}
                  onChange={(e) => updateNode(selectedNode.id, { type: e.target.value as NodeType })}
                  className="bg-black/30 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] [&>option]:bg-[#131B2A]"
                >
                  <option value="intersection">Intersection</option>
                  <option value="hub">Hub</option>
                  <option value="hospital">Hospital</option>
                  <option value="logistics">Logistics</option>
                  <option value="transport">Transport</option>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                </select>
              </div>

              <button 
                onClick={() => deleteNode(selectedNode.id)}
                className="mt-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded flex items-center justify-center gap-2 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Node
              </button>
            </div>
          )}

          {selectedEdge && (
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">Selected Edge</h4>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Base Weight (Distance)</label>
                <input 
                  type="number" 
                  value={selectedEdge.baseWeight}
                  onChange={(e) => updateEdgeWeight(selectedEdge.id, parseInt(e.target.value) || 1)}
                  className="bg-black/30 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                  min="1"
                />
              </div>

              <button 
                onClick={() => deleteEdge(selectedEdge.id)}
                className="mt-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded flex items-center justify-center gap-2 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Edge
              </button>
            </div>
          )}

          {!selectedNode && !selectedEdge && (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-xs italic text-center px-4">
              Select a node or edge to edit its properties.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
