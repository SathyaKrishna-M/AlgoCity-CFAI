import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, ShieldCheck, Network, FolderTree, Plus, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MetricCard } from '../../components/ui/MetricCard';
import { useRecordsStore } from '../../stores/useRecordsStore';
import type { CityRecord } from '../../stores/useRecordsStore';

const TreeVisualizer = ({ node, searchPath, foundNodeId }: { node: CityRecord, searchPath: string[], foundNodeId: string | null }) => {
  const isFound = foundNodeId === node.id;
  const isPath = searchPath.includes(node.id);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isFound ? 1.1 : 1, opacity: 1 }}
        className={`relative z-10 flex flex-col items-center justify-center p-3 w-32 rounded-xl shadow-lg border backdrop-blur-sm transition-colors duration-300
          ${isFound ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
            isPath ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/10 border-white/20'}
        `}
      >
        <span className={`text-xs font-bold ${isFound ? 'text-emerald-300' : isPath ? 'text-amber-300' : 'text-gray-400'}`}>ID: {node.id}</span>
        <span className="font-bold text-white text-sm truncate w-full text-center">{node.name}</span>
        <span className={`text-xs font-mono font-bold mt-1 px-2 py-0.5 rounded border 
          ${isFound ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
            isPath ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20'}
        `}>Val: {node.value}</span>
      </motion.div>

      {(node.left || node.right) && (
        <div className="relative flex justify-center mt-8 gap-8">
          {/* SVG Connecting Lines */}
          <svg className="absolute -top-8 w-full h-8 z-0 pointer-events-none overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 32">
            {node.left && <path d="M 50,0 C 50,15 25,15 25,32" stroke={searchPath.includes(node.left.id) ? '#F59E0B' : 'rgba(255,255,255,0.2)'} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />}
            {node.right && <path d="M 50,0 C 50,15 75,15 75,32" stroke={searchPath.includes(node.right.id) ? '#F59E0B' : 'rgba(255,255,255,0.2)'} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />}
          </svg>

          <div className="flex-1 flex justify-end relative">
            {node.left ? <TreeVisualizer node={node.left} searchPath={searchPath} foundNodeId={foundNodeId} /> : <div className="w-32"></div>}
          </div>
          <div className="flex-1 flex justify-start relative">
            {node.right ? <TreeVisualizer node={node.right} searchPath={searchPath} foundNodeId={foundNodeId} /> : <div className="w-32"></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export function RecordsDatabase() {
  const { rootRecord, totalRecords, insertRecord, resetTree } = useRecordsStore();
  
  const [searchValue, setSearchValue] = useState('');
  const [insertValue, setInsertValue] = useState('');
  const [searchPath, setSearchPath] = useState<string[]>([]);
  const [foundNodeId, setFoundNodeId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchValue || !rootRecord) return;
    const val = parseInt(searchValue);
    if (isNaN(val)) return;

    setIsSearching(true);
    setSearchPath([]);
    setFoundNodeId(null);

    let current: CityRecord | undefined = rootRecord;
    const path: string[] = [];

    while (current) {
      path.push(current.id);
      setSearchPath([...path]);
      
      // Delay for visual effect
      await new Promise(r => setTimeout(r, 600));

      if (current.value === val) {
        setFoundNodeId(current.id);
        setIsSearching(false);
        return;
      }

      if (val < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    // Not found
    setIsSearching(false);
  };

  const handleInsert = () => {
    const val = parseInt(insertValue);
    if (isNaN(val)) return;
    insertRecord({
      id: `R${Math.floor(Math.random() * 1000)}`,
      name: 'New Citizen',
      value: val
    });
    setInsertValue('');
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-black text-white tracking-tight">City Records Database</h1>
        <p className="text-gray-400">Binary Search Tree (BST) for Fast Citizen Lookups</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Total Records" value={totalRecords.toLocaleString()} icon={<Database />} />
        <MetricCard title="Search Complexity" value="O(log n)" icon={<Network />} />
        <MetricCard title="Data Integrity" value="100%" icon={<ShieldCheck />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-500" />
              Query Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-400">Search by Value</label>
              <input 
                type="number" 
                placeholder="e.g. 250" 
                className="p-2 border border-white/10 rounded-md text-sm bg-black/30 text-white focus:ring-[#D4AF37]"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Traversing...' : 'Execute Query'}
              </Button>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-400">Insert Record (Value)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="e.g. 400" 
                  className="flex-1 min-w-0 p-2 border border-white/10 rounded-md text-sm bg-black/30 text-white focus:ring-[#D4AF37]"
                  value={insertValue}
                  onChange={e => setInsertValue(e.target.value)}
                />
                <Button variant="outline" size="icon" onClick={handleInsert}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <h4 className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> System Secure
              </h4>
              <p className="text-xs text-emerald-500/70">All data nodes are correctly balanced and indexed for O(log n) retrieval speeds.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 flex flex-col min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-gray-500" />
                BST Visualization
              </div>
              <Button variant="ghost" size="sm" onClick={resetTree} className="text-xs flex gap-1">
                <RotateCcw className="w-3 h-3" /> Reset
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 bg-black/20 rounded-b-2xl border-t border-white/5 p-8 overflow-auto flex items-start justify-center relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {rootRecord ? (
              <div className="relative pt-4 w-full flex justify-center">
                <TreeVisualizer node={rootRecord} searchPath={searchPath} foundNodeId={foundNodeId} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Tree is empty</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
