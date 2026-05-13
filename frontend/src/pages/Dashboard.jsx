import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SocialWorkerDashboard from './SocialWorkerDashboard';
import AdminDashboard from './AdminDashboard';
import LawEnforcementDashboard from './LawEnforcementDashboard';
import PartnerAgencyDashboard from './PartnerAgencyDashboard';
import { Spinner } from '../components/ui';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'law_enforcement':
      return <LawEnforcementDashboard />;
    case 'partner_agency':
      return <PartnerAgencyDashboard />;
    case 'social_worker':
    default:
      return <SocialWorkerDashboard />;
  }
}
