import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bell, Shield, Clock, ChevronDown, Loader2, Mail } from 'lucide-react';
import { Seo } from '../Seo';
import { supabase } from '../../lib/supabase';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const FAQ_ITEMS = [
  {
    q: 'Where does the data come from?',
    a: 'Official Portuguese government sources: Diário da República (the official gazette), AIMA, Portal das Finanças, and Segurança Social. Every alert links directly to the official publication.',
  },
  {
    q: 'Is this legal advice?',
    a: 'No. We provide plain-English summaries of regulatory changes with links to official sources. Always verify with the official publication or your legal/tax advisor.',
  },
  {
    q: 'What topics are covered?',
    a: 'Immigration (visas, residency, AIMA), tax (IRS, NHR, NIF), social security (NISS), and labor law. You tell us your situation and we only send what affects you.',
  },
  {
    q: 'How is this different from just checking government sites myself?',
    a: 'The Diário da República publishes 100+ items per day - most have nothing to do with you. We filter, translate, and deliver only the changes that affect your specific situation. Saves you hours every week.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no commitments. Cancel with one click. If you stop paying, you stop getting alerts. That is it.',
  },
];

const FaqAccordion: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white dark:bg-[#161618] border-[#0F3D2E]/20 dark:border-[#10B981]/20 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
                : 'bg-white dark:bg-[#161618] border-[#0F3D2E]/8 dark:border-white/8 hover:border-[#0F3D2E]/15 dark:hover:border-white/12'
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <span className={`text-sm font-bold pr-6 transition-colors ${
                isOpen
                  ? 'text-[#0F3D2E] dark:text-[#10B981]'
                  : 'text-slate-900 dark:text-white'
              }`}>
                {item.q}
              </span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                isOpen
                  ? 'bg-[#0F3D2E] text-white dark:bg-[#10B981]'
                  : 'bg-slate-100 dark:bg-white/8 text-slate-400 dark:text-slate-500'
              }`}>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

const FEATURES = [
  {
    icon: Clock,
    title: 'Changes detected in hours',
    desc: 'New laws and regulations flagged within hours of publication. No more finding out 3 weeks late.',
  },
  {
    icon: Shield,
    title: 'Official sources only',
    desc: 'Every alert links to the official government publication. No rumors, no speculation, no third-party interpretation.',
  },
  {
    icon: Bell,
    title: 'Only what affects you',
    desc: 'Tell us your visa type, tax situation, and residency status. We filter out the noise and only send what matters to you.',
  },
  {
    icon: Mail,
    title: 'In your inbox, every week',
    desc: 'Plain-English digest delivered weekly. No dashboard to log into. No app to download. Just open the email and you\'re caught up.',
  },
];

const AUDIENCES = [
  {
    icon: Shield,
    title: 'D7 / D8 visa holders',
    desc: 'One AIMA policy change you missed could delay your renewal by months. We catch it the day it is published.',
  },
  {
    icon: Clock,
    title: 'Freelancers and remote workers',
    desc: 'Portugal changes tax rules mid-year without warning. Miss one and you are filing corrections, not just filing.',
  },
  {
    icon: Bell,
    title: 'NHR / IFICI applicants',
    desc: 'The rules that saved you 20% in taxes can change overnight. Do not find out on your next return.',
  },
];

export const RadarLanding: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Check for Google signup callback
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'success') {
      handleGoogleCallback();
    }
  }, []);

  const handleGoogleCallback = async () => {
    setGoogleLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Google sign-in incomplete. Try again.');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-subscribe-radar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      if (data.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to subscribe. Try email signup.');
      }
    } catch {
      setError('Something went wrong. Try email signup.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-subscribe-radar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/radar?signup=success`,
        },
      });
      if (error) throw error;
    } catch {
      setError('Google sign-up failed. Try again or use email.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Portugal Radar - rule changes that affect you, before they hit you"
        description="Weekly plain-English digest of Portuguese law changes affecting your visa, tax, and residency. €5/mo."
        ogTitle="Portugal Radar - never miss a rule change"
        ogDescription="We monitor 50+ Portuguese government sources and send you only the changes that affect your situation. €5/mo. Cancel anytime."
        ogImage="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
        ogType="website"
        ogUrl="https://app.worktugal.com/radar"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left: copy */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center self-start text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
              FREE COMPLIANCE UPDATES
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
              The Portuguese government publishes 100+ rule changes a day.{' '}
              <span className="text-slate-900/30 dark:text-white/25">One of them will affect your visa, taxes, or residency. We will tell you which one.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Diário da República, AIMA, and tax authority updates translated into plain English. Every alert links to the official source.
            </p>

            {/* Signup form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div>
                  <p className="text-lg font-bold text-[#0F3D2E] dark:text-[#10B981]">You're on the list.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Your first free compliance update is coming this week. Watch your inbox.
                  </p>
                </div>
                <div className="border-t border-[#10B981]/15 pt-4">
                  <p className="text-sm font-bold text-[#0F3D2E] dark:text-[#10B981] mb-3">Want the full brief?</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    Weekly step-by-step actions, gated reports, and full diagnostic history.
                  </p>
                  <a
                    href="https://blog.worktugal.com/#/portal/signup"
                    className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#1A5C44] transition-all"
                  >
                    Subscribe to Worktugal Pro · €5/mo <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-5 py-4 rounded-xl border border-[#0F3D2E]/15 dark:border-white/10 bg-white dark:bg-[#161618] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]/30 dark:focus:ring-[#10B981]/30 text-base"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 bg-[#0F3D2E] text-white px-7 py-4 rounded-xl text-base font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Join free <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-[#0F3D2E]/10 dark:bg-white/10" />
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">or</span>
                  <div className="flex-1 h-px bg-[#0F3D2E]/10 dark:bg-white/10" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={googleLoading}
                  className="w-full inline-flex items-center justify-center gap-3 bg-white dark:bg-[#161618] border border-[#0F3D2E]/15 dark:border-white/10 text-slate-900 dark:text-white px-7 py-4 rounded-xl text-base font-bold hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:shadow-lg hover:shadow-[#0F3D2E]/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign up with Google
                    </>
                  )}
                </button>
              </div>
            )}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            {!submitted && (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                €5/mo. Cancel anytime. If you do not spot a change that affects you, the next month is free.
              </p>
            )}
          </motion.div>

          {/* Right: preview cards */}
          <motion.div
            className="lg:col-span-5 relative flex items-center justify-center min-h-[320px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow blob */}
            <div className="absolute inset-0 bg-[#0F3D2E]/5 dark:bg-[#10B981]/5 rounded-full blur-[80px]" />

            <div className="relative w-full max-w-sm flex flex-col gap-5">
              {/* Alert card 1 */}
              <div
                className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-[#0F3D2E]/10 dark:border-white/8 p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] translate-x-[-8%] hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                    Immigration
                  </span>
                  <span className="text-[10px] text-slate-400">24 Apr 2026</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  AIMA appointment system changes
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  New online booking portal replaces in-person scheduling. Affects all D7, D8, and family reunion applicants.
                </p>
                <a href="https://diariodarepublica.pt" className="text-xs text-[#10B981] font-semibold mt-2 inline-block hover:underline">
                  View official source →
                </a>
              </div>

              {/* Alert card 2 */}
              <div
                className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-[#0F3D2E]/10 dark:border-white/8 p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] translate-x-[12%] hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                    Tax
                  </span>
                  <span className="text-[10px] text-slate-400">22 Apr 2026</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  NHR replacement rules updated
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  IFICI eligibility criteria expanded. New 10-year regime now covers remote workers with foreign employers.
                </p>
                <a href="https://diariodarepublica.pt" className="text-xs text-[#10B981] font-semibold mt-2 inline-block hover:underline">
                  View official source →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Social proof bar ─────────────────────────────────────── */}
      <div className="border-y border-[#0F3D2E]/5 dark:border-white/5 py-8 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 opacity-70">
            {[
              '50+ government sources monitored',
              'Plain-English summaries',
              'Official source links',
            ].map((item, i) => (
              <React.Fragment key={item}>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                  {item}
                </span>
                {i < 2 && (
                  <span className="hidden md:block w-1.5 h-1.5 bg-[#0F3D2E]/20 dark:bg-white/20 rounded-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Who it's for ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
            WHO IT'S FOR
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 mb-4">
            If you live or work in Portugal, the rules affect you.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            You don't need to be a lawyer to care about Portuguese law. If your visa, taxes, or residency depend on knowing when rules change, this is for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {AUDIENCES.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 p-8 rounded-2xl border border-[#0F3D2E]/5 dark:border-white/5 bg-white dark:bg-[#161618] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all"
              >
                <div className="w-12 h-12 bg-[#0F3D2E]/5 dark:bg-[#10B981]/10 text-[#0F3D2E] dark:text-[#10B981] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{a.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{a.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <div className="bg-slate-50 dark:bg-white/[0.02]">
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 mb-4">
            From government source to your inbox in hours.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'We monitor',
              desc: 'Official RSS feeds and government sites checked every 6 hours. Diário da República, AIMA, Portal das Finanças, Seg-Social.',
            },
            {
              step: '2',
              title: 'We translate',
              desc: 'Portuguese legalese → plain English. "What changed" + "Who this affects" + "What to do about it."',
            },
            {
              step: '3',
              title: 'You get alerted',
              desc: 'Weekly digest email filtered by your situation - D7 visa, NHR status, freelancer tax, etc. Only what matters to you.',
            },
            {
              step: '4',
              title: 'You stay protected',
              desc: 'Never miss a deadline. Never get caught off guard by a rule change. Every alert links to the official source.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3"
            >
              <span className="text-4xl font-black text-[#0F3D2E]/20 dark:text-[#10B981]/20">{item.step}</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      </div>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 p-8 rounded-2xl border border-[#0F3D2E]/5 dark:border-white/5 bg-white dark:bg-[#161618] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all"
              >
                <div className="w-12 h-12 bg-[#0F3D2E]/5 dark:bg-[#10B981]/10 text-[#0F3D2E] dark:text-[#10B981] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Cost of inaction ──────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
            THE COST OF NOT KNOWING
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 mb-6">
            What happens if you don't sign up?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">Miss a NISS payment deadline</p>
            <p className="text-3xl font-black text-red-500">€150 to €500</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">in fines</p>
          </div>
          <div className="p-8 rounded-2xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">Miss an AIMA procedure change</p>
            <p className="text-3xl font-black text-amber-500">Months</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">of renewal delays</p>
          </div>
          <div className="p-8 rounded-2xl border border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/20 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">Miss a tax rule change</p>
            <p className="text-3xl font-black text-orange-500">Interest + penalties</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">on your next return</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Radar costs <span className="font-bold text-slate-900 dark:text-white">€5/mo</span>. Not knowing costs more.
          </p>
        </div>
      </section>

      {/* ── Pricing / CTA ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-[#0F3D2E] rounded-2xl p-12 md:p-20 text-center flex flex-col items-center gap-8 relative overflow-hidden">
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <motion.h2
            {...fadeUp}
            className="text-3xl md:text-5xl font-black text-white relative z-10 leading-tight"
          >
            €5/mo. Cancel anytime.
          </motion.h2>
          <p className="text-[#10B981]/80 text-lg md:text-xl max-w-2xl relative z-10 leading-relaxed">
            Weekly digest. Only the changes that affect your situation. Cancel anytime with one click.
          </p>
          {!submitted ? (
            <div className="flex flex-col gap-3 relative z-10 w-full max-w-lg">
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 text-base"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#10B981] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#059669] hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl shadow-black/20 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin inline" /> : 'Get started free'}
                </button>
              </form>

              <div className="flex items-center gap-4 py-1">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-xs text-white/50 font-medium">or</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleLoading}
                className="w-full inline-flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/20 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl shadow-black/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="relative z-10">
              <p className="text-white/80 text-lg">You're on the list. Your first digest is coming this week.</p>
            </div>
          )}
          <p className="text-sm text-white/40 relative z-10">
            No credit card. No commitment. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Common questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Everything you need to know before getting on the Radar.
          </p>
        </motion.div>

        <FaqAccordion />
      </section>
    </>
  );
};
