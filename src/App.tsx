import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PrepPlan from './pages/PrepPlan'
import StaffSchedule from './pages/StaffSchedule'
import Analytics from './pages/Analytics'
import AgingPlan from './pages/AgingPlan'
import Methodology from './pages/Methodology'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="prep" element={<PrepPlan />} />
          <Route path="aging" element={<AgingPlan />} />
          <Route path="schedule" element={<StaffSchedule />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="methodology" element={<Methodology />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
