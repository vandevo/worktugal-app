import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaidReviewLanding } from './PaidReviewLanding';
import { PaidReviewIntakeForm } from './PaidReviewIntakeForm';
import { PaidReviewSuccess } from './PaidReviewSuccess';
import { getReviewByToken, type PaidComplianceReview } from '../../lib/paidComplianceReviews';
import { STRIPE_CONFIG } from '../../stripe-config';
import { Alert } from '../ui/Alert';

type PageState = 'landing' | 'verifying' | 'form' | 'success' | 'error';

export const PaidReviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>('landing');
  const [review, setReview] = useState<PaidComplianceReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const sessionId = searchParams.get('session_id');
  const accessToken = searchParams.get('token');

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    } else if (accessToken) {
      loadReviewByToken(accessToken);
    }
  }, [sessionId, accessToken]);

  const verifyPayment = async (sessionId: string) => {
    setPageState('verifying');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-paid-review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ session_id: sessionId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setReview(data.review);

      if (data.review.status === 'submitted' || data.review.status === 'in_review' || data.review.status === 'completed') {
        setPageState('success');
      } else {
        navigate(`/compliance-review?token=${data.access_token}`, { replace: true });
        setPageState('form');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify payment');
      setPageState('error');
    }
  };

  const loadReviewByToken = async (token: string) => {
    setPageState('verifying');
    try {
      const reviewData = await getReviewByToken(token);

      if (!reviewData) {
        throw new Error('Review not found');
      }

      setReview(reviewData);

      if (reviewData.status === 'submitted' || reviewData.status === 'in_review' || reviewData.status === 'completed') {
        setPageState('success');
      } else {
        setPageState('form');
      }
    } catch (err) {
      console.error('Load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load review');
      setPageState('error');
    }
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const product = STRIPE_CONFIG.products.find(p => p.name === 'Detailed Compliance Risk Review');
      if (!product) {
        throw new Error('Product not found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paid-review-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            price_id: product.priceId,
            success_url: `${window.location.origin}/compliance-review`,
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

  const handleFormComplete = () => {
    setPageState('success');
  };

  if (pageState === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">
            {sessionId ? 'Verifying your payment...' : 'Loading your review...'}
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
                setPageState('landing');
                navigate('/compliance-review', { replace: true });
              }}
              className="text-blue-400 hover:underline"
            >
              Return to landing page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === 'success' && review) {
    return (
      <PaidReviewSuccess
        customerEmail={review.customer_email}
        reviewId={review.id}
      />
    );
  }

  if (pageState === 'form' && review && accessToken) {
    return (
      <PaidReviewIntakeForm
        accessToken={accessToken}
        initialData={review.form_data}
        initialProgress={review.form_progress}
        onComplete={handleFormComplete}
      />
    );
  }

  return (
    <PaidReviewLanding
      onCheckout={handleCheckout}
      isLoading={isCheckoutLoading}
    />
  );
};
