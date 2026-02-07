import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaidReviewLanding } from './PaidReviewLanding';
import { PaidReviewIntakeForm } from './PaidReviewIntakeForm';
import { PaidReviewSuccess } from './PaidReviewSuccess';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { STRIPE_CONFIG } from '../../stripe-config';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { LogIn, UserPlus } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

type PageState = 'landing' | 'loading' | 'form' | 'success' | 'error';

interface UserReviewData {
  has_paid_compliance_review: boolean;
  paid_compliance_review_id: string | null;
  review?: {
    id: string;
    status: string;
    form_data: Record<string, any>;
    form_progress: { sections_completed: string[] };
    customer_email: string;
  };
}

export const PaidReviewPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [reviewData, setReviewData] = useState<UserReviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setPageState('landing');
      return;
    }

    loadUserReviewStatus();
  }, [user, authLoading]);

  const loadUserReviewStatus = async () => {
    if (!user) return;

    setPageState('loading');
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('has_paid_compliance_review, paid_compliance_review_id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profile?.has_paid_compliance_review && profile?.paid_compliance_review_id) {
        const { data: review, error: reviewError } = await supabase
          .from('paid_compliance_reviews')
          .select('id, status, form_data, form_progress, customer_email')
          .eq('id', profile.paid_compliance_review_id)
          .maybeSingle();

        if (reviewError) throw reviewError;

        if (review) {
          setReviewData({
            has_paid_compliance_review: true,
            paid_compliance_review_id: profile.paid_compliance_review_id,
            review: review as any
          });

          if (review.status === 'submitted' || review.status === 'in_review' || review.status === 'completed') {
            setPageState('success');
          } else {
            setPageState('form');
          }
          return;
        }
      }

      setReviewData({
        has_paid_compliance_review: false,
        paid_compliance_review_id: null
      });
      setPageState('landing');
    } catch (err) {
      console.error('Error loading review status:', err);
      setError('Failed to load your review status');
      setPageState('error');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const product = STRIPE_CONFIG.products.find(p => p.name === 'Compliance Readiness Review');
      if (!product) {
        throw new Error('Product not found');
      }

      const { data: sessionData } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paid-review-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session?.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            price_id: product.priceId,
            user_id: user.id,
            user_email: user.email,
            success_url: `${window.location.origin}/compliance-review?payment=success`,
            cancel_url: `${window.location.origin}/compliance-review`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
      setIsCheckoutLoading(false);
    }
  };

  const handlePaymentVerification = async () => {
    if (!user) return;

    setPageState('loading');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-paid-review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ user_id: user.id }),
        }
      );

      const data = await response.json();

      if (data.success) {
        await loadUserReviewStatus();
      } else {
        setError('Payment verification failed. Please contact support.');
        setPageState('error');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify payment');
      setPageState('error');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && user) {
      handlePaymentVerification();
      window.history.replaceState({}, '', '/compliance-review');
    }
  }, [user]);

  const handleFormComplete = () => {
    setPageState('success');
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const openSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  if (authLoading || pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">
            {authLoading ? 'Checking authentication...' : 'Loading your review...'}
          </p>
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error" className="mb-6">
            {error || 'Something went wrong'}
          </Alert>
          <div className="text-center">
            <button
              onClick={() => {
                setError(null);
                loadUserReviewStatus();
              }}
              className="text-blue-400 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === 'success' && reviewData?.review) {
    return (
      <PaidReviewSuccess
        customerEmail={reviewData.review.customer_email || user?.email || ''}
        reviewId={reviewData.review.id}
      />
    );
  }

  if (pageState === 'form' && reviewData?.review && user) {
    return (
      <PaidReviewIntakeForm
        userId={user.id}
        reviewId={reviewData.review.id}
        initialData={reviewData.review.form_data}
        initialProgress={reviewData.review.form_progress}
        onComplete={handleFormComplete}
      />
    );
  }

  return (
    <>
      <PaidReviewLanding
        onCheckout={handleCheckout}
        isLoading={isCheckoutLoading}
        isAuthenticated={!!user}
        onSignIn={openSignIn}
        onSignUp={openSignUp}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};
