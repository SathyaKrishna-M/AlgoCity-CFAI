import {} from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BookOpen, Code, PlayCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const topics = [
  {
    id: 'bfs',
    title: 'Breadth-First Search (BFS)',
    category: 'Graph Algorithm',
    complexity: 'O(V + E)',
    description: 'Explores equally in all directions. It guarantees the shortest path on unweighted graphs by visiting all immediate neighbors before moving deeper.',
    usage: 'Finding the shortest path in unweighted grids, network broadcasting, social network connections.',
    mistakes: 'Using a Stack instead of a Queue; forgetting to mark nodes as visited *before* enqueuing them.',
    facts: ['Optimal for unweighted shortest paths', 'Uses a Queue (FIFO)', 'Memory heavy for wide graphs']
  },
  {
    id: 'dfs',
    title: 'Depth-First Search (DFS)',
    category: 'Graph Algorithm',
    complexity: 'O(V + E)',
    description: 'Explores as far as possible along each branch before backtracking. Great for exhaustively searching a space or finding connected components.',
    usage: 'Maze solving, topological sorting, cycle detection in dependencies.',
    mistakes: 'Infinite loops in cyclic graphs if visited set is ignored; stack overflow on very deep graphs in recursive implementations.',
    facts: ['Uses a Stack (LIFO)', 'Memory efficient for deep graphs', 'Not guaranteed to find shortest path']
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Algorithm",
    category: 'Graph Algorithm',
    complexity: 'O((V + E) log V)',
    description: 'Finds the shortest path from a source to all other nodes in a graph with non-negative edge weights using a priority queue.',
    usage: 'GPS routing, IP routing protocols, logistics planning.',
    mistakes: 'Applying it to graphs with negative edge weights; using a standard Queue instead of a Priority Queue.',
    facts: ['Requires non-negative weights', 'Uses a Min-Priority Queue', 'Explores radially like a weighted BFS']
  },
  {
    id: 'priority_queue',
    title: 'Priority Queue (Min-Heap)',
    category: 'Data Structure',
    complexity: 'O(log N) insert/extract',
    description: 'An abstract data type where each element has a priority. Elements with higher priority are served before elements with lower priority.',
    usage: 'Emergency dispatch queues, task scheduling, Dijkstra/A* implementations.',
    mistakes: 'Confusing it with a standard sorted array (O(N) inserts); forgetting to bubble-up/bubble-down after mutation.',
    facts: ['Usually implemented via Binary Heap', 'O(1) find-min', 'Complete binary tree structure']
  }
];

export function LearningHub() {
  const [activeTopic, setActiveTopic] = useState(topics[0].id);
  const selected = topics.find(t => t.id === activeTopic)!;

  return (
    <div className="h-full flex flex-col space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Interactive Learning Academy</h1>
          <p className="text-gray-400">Master algorithms and data structures through real-world city applications.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Curriculum</h3>
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTopic === topic.id ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}
            >
              {topic.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          <Card className="border-t-4 border-t-[#D4AF37]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">{selected.category}</span>
                  <CardTitle className="text-2xl text-white">{selected.title}</CardTitle>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Time Complexity</span>
                  <span className="font-mono font-bold text-lg text-gray-300">{selected.complexity}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">How it works</h4>
                <p className="text-gray-400 leading-relaxed">{selected.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2"><Code className="w-4 h-4"/> Real-World Application</h4>
                  <div className="bg-[#3B82F6]/10 p-4 rounded-lg border border-[#3B82F6]/20 text-[#3B82F6] text-sm h-full">
                    {selected.usage}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Common Mistakes</h4>
                  <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 text-red-400 text-sm h-full">
                    {selected.mistakes}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Quick Facts</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.facts.map((fact, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-xs font-medium border border-white/10">
                      {fact}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex gap-4">
                <Button className="flex gap-2">
                   <PlayCircle className="w-4 h-4" /> Launch Interactive Demo
                </Button>
                <Button variant="outline">Take the Quiz</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
