import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createCheckoutSession } from '../../lib/stripe-checkout';

const PRO_MONTHLY_PRICE_ID = 'price_1TT5PQBm1NepJXMzCuLHVV08';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export const SubscribePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const { url } = await createCheckoutSession({
        priceId: PRO_MONTHLY_PRICE_ID,
        mode: 'subscription',
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/subscribe`,
        paymentType: 'radar-subscription',
      });
      window.location.href = url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start checkout. Please try again.';
      if (message !== 'Authentication required') {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/8 rounded-2xl p-10 text-center max-w-sm shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-[#10B981]" />
          <p className="text-slate-600 dark:text-slate-400">Redirecting to sign-in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 pt-16 pb-24">
      <motion.div className="max-w-md w-full" {...fadeUp}>
        <span className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-6">
          WORKTUGAL PRO
        </span>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
          What changed, what it means, and exactly what to do.
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
          Free updates tell you what changed. Worktugal Pro tells you what to do about it — step-by-step, before the next deadline.
        </p>

        <div className="bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/8 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-black text-slate-900 dark:text-white">€5</span>
            <span className="text-slate-400 dark:text-slate-500">/month</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Cancel anytime. First month free if we miss anything that affects your situation.
          </p>

          <ul className="space-y-3 mb-8">
            {[
              'Weekly digest: what changed, what it means, what to do',
              'Step-by-step actions before each deadline',
              'Compliance calendar: upcoming filing deadlines',
              'Access to full briefing archive',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <Shield className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0F3D2E] text-white px-6 py-4 rounded-xl text-base font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Subscribe to Worktugal Pro <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {error && (
            <p className="text-sm text-red-500 mt-4 text-center">{error}</p>
          )}

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 text-center">
            Signed in as {user.email}. Not you?{' '}
            <a href="/login?redirect=subscribe" className="text-[#10B981] hover:underline">
              Switch account
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
