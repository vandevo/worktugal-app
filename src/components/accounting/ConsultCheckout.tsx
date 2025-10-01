import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getConsultBooking } from '../../lib/consults';
import { CONSULT_SERVICES } from '../../types/accounting';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Loader2 } from 'lucide-react';

export const ConsultCheckout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('booking');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await getConsultBooking(parseInt(bookingId));

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error('Booking not found');
        }

        setBooking(data);
      } catch (err) {
        console.error('Error loading booking:', err);
        setError(err instanceof Error ? err.message : 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const handleCheckout = async () => {
    if (!booking) return;

    setCheckingOut(true);
    setError(null);

    try {
      const service = CONSULT_SERVICES.find(s => s.id === booking.service_type);
      if (!service) {
        throw new Error('Service not found');
      }

      const priceId = service.stripePriceId;
      if (!priceId) {
        throw new Error('Price configuration not found. Please contact support.');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode: 'payment',
          submission_id: booking.id,
          payment_type: 'consult',
          success_url: `${window.location.origin}/accounting/success?booking=${booking.id}`,
          cancel_url: `${window.location.origin}/accounting/checkout?booking=${booking.id}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Booking Not Found</h2>
          <p className="text-gray-300 mb-6">
            {error || 'The booking you are looking for could not be found.'}
          </p>
          <Button onClick={() => navigate('/accounting')}>
            Back to Accounting Desk
          </Button>
        </div>
      </div>
    );
  }

  const service = CONSULT_SERVICES.find(s => s.id === booking.service_type);

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Complete Your Booking</h1>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Booking Summary</h2>

            <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-400">Service</p>
                <p className="text-lg font-semibold text-white">{service?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-gray-200">{booking.full_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-gray-200">{booking.email}</p>
              </div>

              {booking.phone && (
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-gray-200">{booking.phone}</p>
                </div>
              )}

              {booking.preferred_date && (
                <div>
                  <p className="text-sm text-gray-400">Preferred Date</p>
                  <p className="text-gray-200">
                    {new Date(booking.preferred_date).toLocaleString()}
                  </p>
                </div>
              )}

              {booking.notes && (
                <div>
                  <p className="text-sm text-gray-400">Notes</p>
                  <p className="text-gray-200">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/[0.10] pt-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">€{service?.price}</span>
            </div>
            <p className="text-sm text-gray-400">
              Includes VAT. Payment processed securely via Stripe.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full"
            >
              {checkingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/accounting')}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
