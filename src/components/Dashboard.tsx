import { useUserProfile } from '../hooks/useUserProfile';
import { AdminOverview } from './admin/AdminOverview';
import { ClientDashboard } from './client/ClientDashboard';

export function Dashboard() {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profile?.role === 'admin') {
    return <AdminOverview />;
  }

  return <ClientDashboard />;
}
