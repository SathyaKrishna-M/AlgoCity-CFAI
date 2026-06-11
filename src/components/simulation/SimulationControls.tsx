import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { useSimulationStore } from '../../stores/useSimulationStore';
import { Button } from '../ui/Button';

export function SimulationControls() {
  const store = useSimulationStore();

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-xl border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={store.reset} title="Reset"><RotateCcw className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" onClick={store.stepBackward} disabled={store.currentStepIndex === 0} title="Step Backward"><SkipBack className="w-4 h-4" /></Button>
          <Button variant={store.isPlaying ? "outline" : "default"} size="icon" onClick={store.isPlaying ? store.pause : store.play} title={store.isPlaying ? "Pause" : "Play"}>
            {store.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={store.stepForward} disabled={store.getIsFinished()} title="Step Forward"><SkipForward className="w-4 h-4" /></Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Speed:</span>
          <select 
            className="text-sm border-gray-200 rounded-md focus:ring-primary focus:border-primary p-1 bg-gray-50"
            value={store.speedMultiplier}
            onChange={(e) => store.setSpeed(Number(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={2}>2.0x</option>
            <option value={5}>5.0x</option>
            <option value={10}>10.0x</option>
          </select>
        </div>
      </div>
      
      {/* Timeline Slider */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-gray-400 font-mono">
          <span>Step {store.currentStepIndex}</span>
          <span>Max {Math.max(0, store.steps.length - 1)}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max={Math.max(0, store.steps.length - 1)} 
          value={store.currentStepIndex}
          onChange={(e) => store.goToStep(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
}
