import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

import { Dashboard } from './pages/Dashboard';
import { TrafficLab } from './pages/TrafficLab';
import { DispatchCenter } from './pages/DispatchCenter';
import { TransportNetwork } from './pages/TransportNetwork';
import { LogisticsHub } from './pages/LogisticsHub';
import { ServiceCenter } from './pages/ServiceCenter';
import { RecordsDatabase } from './pages/RecordsDatabase';
import { Analytics } from './pages/Analytics';
import { PresentationDashboard } from './pages/Presentation';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/traffic" element={<TrafficLab />} />
          <Route path="/dispatch" element={<DispatchCenter />} />
          <Route path="/transport" element={<TransportNetwork />} />
          <Route path="/logistics" element={<LogisticsHub />} />
          <Route path="/service" element={<ServiceCenter />} />
          <Route path="/records" element={<RecordsDatabase />} />
          <Route path="/planner" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/presentation" element={<PresentationDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
