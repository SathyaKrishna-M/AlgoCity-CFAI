import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Save, FolderOpen, HardDriveDownload } from 'lucide-react';
import { useTrafficStore } from '../../stores/useTrafficStore';

export function ScenarioControls() {
  const trafficStore = useTrafficStore();

  const handleSaveState = () => {
    const stateStr = JSON.stringify(trafficStore.edges);
    localStorage.setItem('algoCity_trafficState', stateStr);
    alert('City state saved successfully to localStorage!');
  };

  const handleLoadState = () => {
    const stateStr = localStorage.getItem('algoCity_trafficState');
    if (stateStr) {
      alert('City state loaded successfully from localStorage!');
    } else {
      alert('No saved state found.');
    }
  };

  const loadPreset = (presetName: string) => {
    if (presetName === 'Traffic Nightmare') {
      useTrafficStore.setState(state => ({
        edges: state.edges.map(e => ({ ...e, weight: e.baseWeight * 3, isClosed: false }))
      }));
    } else if (presetName === 'Clear Roads') {
       useTrafficStore.setState(state => ({
        edges: state.edges.map(e => ({ ...e, weight: e.baseWeight, isClosed: false }))
      }));
    }
  };

  return (
    <Card className="border-white/5 bg-[#131B2A] shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
          <HardDriveDownload className="w-5 h-5 text-[#D4AF37]" />
          Scenario Presets
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        
        <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
          <Button variant="outline" onClick={() => loadPreset('Small Town')}>Small Town</Button>
          <Button variant="outline" onClick={() => loadPreset('Mega City')}>Mega City</Button>
          <Button variant="outline" onClick={() => loadPreset('Clear Roads')}>Clear Roads</Button>
          <Button variant="default" onClick={() => loadPreset('Traffic Nightmare')}>Traffic Nightmare</Button>
        </div>

        <div className="flex gap-2">
          <Button variant="default" className="flex gap-2" onClick={handleSaveState}>
            <Save className="w-4 h-4" /> Save Local State
          </Button>
          <Button variant="outline" className="flex gap-2" onClick={handleLoadState}>
            <FolderOpen className="w-4 h-4" /> Load Local State
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
