import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AnonymousReport from './pages/AnonymousReport';
import ReportConfirmation from './pages/ReportConfirmation';
import TrackCase from './pages/TrackCase';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import CaseDetail from './pages/CaseDetail';
import Statistics from './pages/Statistics';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import SystemSettings from './pages/admin/SystemSettings';
import Perpetrators from './pages/law-enforcement/Perpetrators';
import Warrants from './pages/law-enforcement/Warrants';
import Evidence from './pages/law-enforcement/Evidence';
import Investigations from './pages/law-enforcement/Investigations';
import LawEnforcementReports from './pages/law-enforcement/Reports';
import LawEnforcementAnalytics from './pages/law-enforcement/Analytics';
import Collaborations from './pages/law-enforcement/Collaborations';
import Alerts from './pages/law-enforcement/Alerts';
import LawEnforcementStatistics from './pages/law-enforcement/Statistics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<AnonymousReport />} />
          <Route path="/report-confirmation" element={<ReportConfirmation />} />
          <Route path="/track" element={<TrackCase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cases" element={<CaseList />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
              <Route path="/statistics" element={<Statistics />} />
              
              {/* Law Enforcement Routes */}
              <Route path="/law-enforcement/investigations" element={<Investigations />} />
              <Route path="/law-enforcement/perpetrators" element={<Perpetrators />} />
              <Route path="/law-enforcement/warrants" element={<Warrants />} />
              <Route path="/law-enforcement/evidence" element={<Evidence />} />
              <Route path="/law-enforcement/reports" element={<LawEnforcementReports />} />
              <Route path="/law-enforcement/analytics" element={<LawEnforcementAnalytics />} />
              <Route path="/law-enforcement/collaborations" element={<Collaborations />} />
              <Route path="/law-enforcement/alerts" element={<Alerts />} />
              <Route path="/law-enforcement/statistics" element={<LawEnforcementStatistics />} />
              
              {/* Admin Routes */}
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/system" element={<SystemSettings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
