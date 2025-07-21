import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

interface ProtectedSuccessRouteProps {
  children: React.ReactNode;
}

export const ProtectedSuccessRoute: React.FC<ProtectedSuccessRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { hasActivePayment, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for development bypass parameter
    const isDevBypass = import.meta.env.DEV && searchParams.get('dev_bypass') === 'true';
    
    if (isDevBypass) {
      console.warn('🔧 DEV BYPASS: Accessing SuccessPage without payment verification');
      return; // Allow access in development mode
    }

    // Only redirect once we have loaded both auth and subscription data
    if (!authLoading && !subscriptionLoading) {
      if (!user || !hasActivePayment) {
        navigate('/', { replace: true });
      }
    }
  }, [user, hasActivePayment, authLoading, subscriptionLoading, navigate, searchParams]);

  // Check for development bypass
  const isDevBypass = import.meta.env.DEV && searchParams.get('dev_bypass') === 'true';

  // Show loading spinner while authentication or subscription data is being fetched
  if ((authLoading || subscriptionLoading) && !isDevBypass) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying your access...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated or does not have an active payment, don't render anything
  // (useEffect will handle the redirect)
  if ((!user || !hasActivePayment) && !isDevBypass) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If authenticated and has active payment, OR dev bypass is active, render the children (SuccessPage)
  return <>{children}</>;
};