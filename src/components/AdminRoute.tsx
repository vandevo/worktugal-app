import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../lib/profile';
import { AuthModal } from './auth/AuthModal';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.id);
        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('[AdminRoute] Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthModal
        isOpen={true}
        onClose={() => {}}
        initialMode="login"
      />
    );
  }

  if (isAdmin === false) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
