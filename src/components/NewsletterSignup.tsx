import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/subscribe-newsletter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (data.ok) {
        setStatus('success');
        setMessage(data.already_subscribed ? "You're already subscribed!" : "You're in. Welcome to Worktugal.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="border-t border-[#0F3D2E]/6 dark:border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <aside className="border border-[#10B981]/20 dark:border-[#10B981]/20 bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl p-7 md:p-8 flex flex-col rounded-2xl shadow-[0_8px_30px_rgba(15,61,46,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <p className="font-jakarta text-xl md:text-2xl leading-tight mb-2 text-slate-900 dark:text-white font-bold">
              This week in AI hiring
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-pretty mb-5">
              European AI job openings, visa route changes, company expansions, and regulation shifts — distilled from FT, Politico, and direct sources. Five minutes, every Monday.
            </p>

            {status === 'success' ? (
              <div className="flex items-center gap-2 text-sm text-[#10B981] font-medium">
                <Check className="w-4 h-4" />
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
                <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    className="h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium flex-1 focus:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                    disabled={status === 'loading'}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#0F3D2E] text-white text-sm font-bold hover:bg-[#1A5C44] hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
                {status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">{message}</p>
                )}
              </form>
            )}
          </aside>
        </motion.div>
      </div>
    </section>
  );
}
