import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { SubscriptionStatus } from './SubscriptionStatus';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { User, Settings, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from './admin/AdminDashboard';
import { ClientDashboard } from './client/ClientDashboard';

export function Dashboard() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (profile?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (profile?.role === 'accountant') {
    return <ClientDashboard />;
  }

  return <ClientDashboard />;
}