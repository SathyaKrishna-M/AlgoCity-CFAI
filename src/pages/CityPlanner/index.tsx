import {} from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Download, Upload, Save, MapPin } from 'lucide-react';
import { GraphCanvas } from '../../components/visualizers/GraphCanvas';
import type { GraphState, GraphNode, GraphEdge } from '../../algorithms/graph/types';
import { useTrafficStore } from '../../stores/useTrafficStore';

export function CityPlanner() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  const handleAddNode = () => {
    const id = String.fromCharCode(65 + nodes.length); // A, B, C...
    setNodes([...nodes, { id, label: 'New Node', x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 }]);
  };

  const handleAddEdge = () => {
    if (nodes.length < 2) return;
    const source = nodes[Math.floor(Math.random() * nodes.length)].id;
    let target = nodes[Math.floor(Math.random() * nodes.length)].id;
    while (target === source) {
      target = nodes[Math.floor(Math.random() * nodes.length)].id;
    }
    setEdges([...edges, { id: `e${edges.length + 1}`, source, target, weight: Math.floor(Math.random() * 10) + 1, baseWeight: 5, isClosed: false }]);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "custom_city.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const deployToCity = () => {
    const mappedNodes = nodes.map(n => ({ ...n, type: 'intersection' as const }));
    const mappedEdges = edges.map(e => ({ ...e, points: [], baseWeight: e.baseWeight || e.weight, isClosed: !!e.isClosed }));
    useTrafficStore.setState({ nodes: mappedNodes, edges: mappedEdges });
    alert("Deployed to live simulation!");
  };

  const mockState: GraphState = {
    nodes,
    edges,
    visited: [],
    frontier: [],
    activePath: []
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <MapPin className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom City Builder</h1>
          <p className="text-text-secondary">Design your own smart city infrastructure and deploy it to the live simulation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Editor Tools</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 overflow-y-auto">
            <div className="flex gap-2">
              <Button onClick={handleAddNode} className="flex-1 flex gap-2"><Plus className="w-4 h-4"/> Add Node</Button>
              <Button onClick={handleAddEdge} className="flex-1 flex gap-2"><Plus className="w-4 h-4"/> Add Edge</Button>
            </div>
            
            <hr className="border-gray-100" />
            
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-sm">Nodes ({nodes.length})</h4>
              {nodes.map((n) => (
                <div key={n.id} className="text-xs flex justify-between p-2 bg-gray-50 rounded border border-gray-100">
                  <span className="font-bold">{n.id}</span>
                  <span>{n.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <h4 className="font-semibold text-sm">Edges ({edges.length})</h4>
              {edges.map((e) => (
                <div key={e.id} className="text-xs flex justify-between p-2 bg-gray-50 rounded border border-gray-100">
                  <span className="font-bold">{e.source} → {e.target}</span>
                  <span>Weight: {e.weight}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-2">
              <Button variant="outline" className="flex gap-2" onClick={exportJSON}><Download className="w-4 h-4"/> Export JSON</Button>
              <Button variant="outline" className="flex gap-2"><Upload className="w-4 h-4"/> Import JSON</Button>
              <Button className="flex gap-2 bg-green-600 hover:bg-green-700 mt-2" onClick={deployToCity}><Save className="w-4 h-4"/> Deploy to Live City</Button>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2 relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          <GraphCanvas state={mockState} />
        </div>
      </div>
    </div>
  );
}
