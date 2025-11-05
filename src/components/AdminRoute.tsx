import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { AuthModal } from './auth/AuthModal';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  console.log('[AdminRoute] Render check:', {
    authLoading,
    profileLoading,
    hasUser: !!user,
    userId: user?.id,
    profile: profile ? {
      id: profile.id,
      display_name: profile.display_name,
      role: profile.role
    } : null,
  });

  if (authLoading || profileLoading) {
    console.log('[AdminRoute] Still loading - showing spinner');
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('[AdminRoute] No user - showing auth modal');
    return (
      <AuthModal
        isOpen={true}
        onClose={() => {}}
        initialMode="login"
      />
    );
  }

  if (!profile) {
    console.error('[AdminRoute] User exists but profile is NULL - this should not happen!', {
      userId: user.id,
      userEmail: user.email
    });
    return <Navigate to="/dashboard" replace />;
  }

  if (profile.role !== 'admin') {
    console.log('[AdminRoute] Access denied - user is not admin', {
      role: profile.role,
    });
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[AdminRoute] ✅ Access granted to admin dashboard');
  return <>{children}</>;
};
