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

  console.log('[AdminRoute] Debug:', {
    authLoading,
    profileLoading,
    hasUser: !!user,
    profile: profile ? { id: profile.id, email: profile.email, role: profile.role } : null,
  });

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('[AdminRoute] No user, showing auth modal');
    return (
      <AuthModal
        isOpen={true}
        onClose={() => {}}
        initialMode="login"
      />
    );
  }

  if (!profile || profile.role !== 'admin') {
    console.log('[AdminRoute] Access denied - redirecting to dashboard', {
      hasProfile: !!profile,
      role: profile?.role,
    });
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[AdminRoute] Access granted');
  return <>{children}</>;
};
