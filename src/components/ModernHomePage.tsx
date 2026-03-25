import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Seo } from './Seo';
import { CheckupFAQ } from './accounting/CheckupFAQ';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const FEATURES = [
  {
    icon: BarChart2,
    title: 'Dual scoring system',
    desc: 'A unique methodology combining Setup Score and Exposure Index for total clarity on your compliance status.',
  },
  {
    icon: AlertTriangle,
    title: 'Trap detection',
    desc: 'Our engine identifies hidden compliance traps specific to remote workers and founders before they occur.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified sources',
    desc: 'Every finding is verified against official AT, AIMA, and Segurança Social regulations. No speculation.',
  },
];

export const ModernHomePage: React.FC = () => {
  return (
    <>
      <Seo
        title="Worktugal: find hidden compliance risks before Portugal fines you"
        description="Free 2-minute diagnostic for remote workers, freelancers, and expats in Portugal. Discover compliance traps, penalty exposure, and corrective actions with legal citations."
        ogTitle="Worktugal: compliance risk diagnostic for remote workers and freelancers in Portugal"
        ogDescription="13 questions. Dual risk scoring. Source-cited legal basis. Find what you missed before it costs you up to €3,750."
        ogImage="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
        ogType="website"
        ogUrl="https://app.worktugal.com/"
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center self-start text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
              FREE · 2 MINUTES · NO SIGNUP REQUIRED
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
              Know your Portugal compliance risk.{' '}
              <span className="text-slate-900/30 dark:text-white/25">Before it costs you.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              The free diagnostic trusted by 1,000+ remote workers, freelancers, and founders navigating Portugal's complex tax and visa system.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/diagnostic"
                className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-7 py-4 rounded-xl text-base font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Run your free diagnostic <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/diagnostic/results?id=demo"
                className="inline-flex items-center gap-2 px-7 py-4 text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-[#0F3D2E]/5 dark:hover:bg-white/5 rounded-xl transition-all"
              >
                See a sample result
              </Link>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Create a free account to save your results and track your compliance status over time.
            </p>
          </motion.div>

          {/* Right — floating score cards */}
          <motion.div
            className="lg:col-span-5 relative flex items-center justify-center min-h-[320px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow blob */}
            <div className="absolute inset-0 bg-[#0F3D2E]/5 dark:bg-[#10B981]/5 rounded-full blur-[80px]" />

            <div className="relative w-full max-w-sm flex flex-col gap-5">
              {/* Setup Score card */}
              <div
                className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-[#0F3D2E]/10 dark:border-white/8 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] translate-x-[-8%] hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Setup Score</span>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-black text-[#10B981]">74</span>
                  <span className="text-xl font-bold text-slate-400">/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full" style={{ width: '74%' }} />
                </div>
              </div>

              {/* Exposure Index card */}
              <div
                className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-[#0F3D2E]/10 dark:border-white/8 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] translate-x-[12%] hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Exposure Index</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-500">18</span>
                  <span className="text-base font-bold text-slate-500 dark:text-slate-400">pts</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 italic">Low risk detected in social security filings</p>
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
              '1,000+ users',
              'Verified against AT, AIMA, Segurança Social',
              'Free forever',
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

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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

      {/* ── CTA section ──────────────────────────────────────────── */}
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
            Ready to check your compliance status?
          </motion.h2>
          <p className="text-[#10B981]/80 text-lg md:text-xl max-w-2xl relative z-10 leading-relaxed">
            Join 1,000+ professionals who secured their life in Portugal with our intelligence platform.
          </p>
          <Link
            to="/diagnostic"
            className="bg-[#10B981] text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-[#059669] hover:scale-[1.03] active:scale-[0.97] transition-all relative z-10 shadow-2xl shadow-black/20"
          >
            Run free diagnostic
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <CheckupFAQ />
    </>
  );
};
