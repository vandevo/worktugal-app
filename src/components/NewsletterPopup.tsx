import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const POPUP_DELAY_MS = 15000;
const DISMISSED_KEY = 'wt-newsletter-dismissed';
const SUBSCRIBED_KEY = 'wt-newsletter-subscribed';

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    if (localStorage.getItem(SUBSCRIBED_KEY)) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    const timer = setTimeout(() => setShow(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/subscribe-newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus('success');
        localStorage.setItem(SUBSCRIBED_KEY, 'true');
        setTimeout(() => setShow(false), 2500);
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('idle');
    }
  };

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 shadow-[0_32px_64px_rgba(0,0,0,0.2)] p-8"
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/[0.10] transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>

            {status === 'success' ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">You are in.</p>
                <p className="text-sm text-slate-400 mt-1">Every Monday. No spam, ever.</p>
              </div>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-4 border border-[#10B981]/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Weekly briefing
                </span>
                <p className="font-jakarta text-xl font-bold text-slate-900 dark:text-white mb-2">
                  This week in AI hiring
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Every Monday: the best AI roles in Europe, visa route changes, and company expansions distilled from 20+ sources across the continent.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    className="h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                    disabled={status === 'loading'}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="h-12 rounded-xl bg-[#0F3D2E] text-white text-sm font-bold hover:bg-[#1A5C44] hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                <button onClick={dismiss} className="w-full text-center text-xs text-slate-400 hover:text-slate-500 mt-4 transition-colors">
                  No thanks, I will browse jobs
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
