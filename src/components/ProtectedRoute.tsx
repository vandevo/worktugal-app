import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './auth/AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <AuthModal
        isOpen={true}
        onClose={() => {}}
        initialMode="login"
      />
    );
  }

  return <>{children}</>;
};