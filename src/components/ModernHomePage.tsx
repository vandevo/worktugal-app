import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Building2, Search, SlidersHorizontal, Bell } from 'lucide-react';
import { Seo } from './Seo';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const COMPANIES = ['Anthropic', 'Stripe', 'Databricks', 'GitLab', 'Mistral AI', 'Figma'];

export const ModernHomePage: React.FC = () => {
  return (
    <>
      <Seo
        title="AI Jobs in Europe – Worktugal"
        description="Curated AI and tech jobs for remote professionals in Europe. Browse roles from Anthropic, Stripe, Databricks, GitLab, Mistral AI, and more. Updated daily."
        ogTitle="AI Jobs in Europe"
        ogDescription="Curated AI and tech jobs open to candidates in Europe. No signup needed to browse."
      />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#0F3D2E]/3 dark:bg-[#10B981]/3 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#10B981]/3 dark:bg-[#10B981]/5 rounded-full blur-[100px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              545 EU-eligible jobs · Updated daily
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-5">
              AI jobs in Europe.
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed mb-8">
              Curated roles from leading AI companies. All open to candidates in Europe. No signup needed.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-7 py-3.5 rounded-xl text-base font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 transition-all"
              >
                Browse 500+ jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right — floating stats */}
          <motion.div
            className="lg:col-span-5 relative flex items-center justify-center min-h-[300px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 bg-[#0F3D2E]/5 dark:bg-[#10B981]/5 rounded-full blur-[80px]" />

            <div className="relative w-full max-w-sm flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-[#0F3D2E]/10 dark:border-white/8 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Active Listings</span>
                  <div className="w-8 h-8 bg-[#0F3D2E]/5 dark:bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-[#0F3D2E] dark:text-[#10B981]" />
                  </div>
                </div>
                <span className="text-5xl font-black text-slate-900 dark:text-white">545</span>
                <p className="text-xs text-slate-400 mt-1">EU-eligible AI roles</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-[#0F3D2E]/10 dark:border-white/8 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Companies</span>
                  <div className="w-8 h-8 bg-[#0F3D2E]/5 dark:bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-[#0F3D2E] dark:text-[#10B981]" />
                  </div>
                </div>
                <span className="text-4xl font-black text-slate-900 dark:text-white">6</span>
                <p className="text-xs text-slate-400 mt-1">Anthropic · Stripe · Databricks · GitLab · Mistral · Figma</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Company logos ─────────────────────────────────── */}
      <div className="border-y border-[#0F3D2E]/6 dark:border-white/6 py-10 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-center mb-5">
            Featuring jobs from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-3">
            {COMPANIES.map((name) => (
              <span key={name} className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">Simple by design</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">How it works</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {[
            { step: '01', icon: Search, title: 'Browse', desc: '500+ AI and tech roles from companies hiring in Europe. Updated daily from official ATS feeds.' },
            { step: '02', icon: SlidersHorizontal, title: 'Filter', desc: 'Narrow by company, department, and seniority. D8 visa eligibility, remote policy, and location on every card.' },
            { step: '03', icon: Bell, title: 'Apply', desc: 'Click through to the company application page. No Worktugal account needed. No tracking. No spam.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0F3D2E]/5 dark:bg-[#10B981]/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-[#0F3D2E] dark:text-[#10B981]" />
                </div>
                <span className="text-[10px] font-black text-[#10B981] tracking-widest">{item.step}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Value props ───────────────────────────────────── */}
      <section className="border-t border-[#0F3D2E]/6 dark:border-white/6 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">Built differently</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">For Europe's AI talent market</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              { t: 'EU-eligible roles', d: 'Every listing checked against location data. US-only roles are filtered out before you see them.' },
              { t: 'Visa and tax signals', d: 'D8 visa eligibility, IFICI tax compatibility, and visa sponsorship flagged where available.' },
              { t: 'Seniority classified', d: 'Entry to executive, auto-classified from the title. Filter by experience without reading every description.' },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center px-4"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{f.t}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Employer CTA ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">For employers</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3 mb-4">
            Hire AI talent across Europe
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
            Reach qualified AI candidates. EUR 49 per listing. Reviewed before going live.
          </p>
          <Link
            to="/jobs/post"
            className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 transition-all"
          >
            Post a job for €49 <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* ── Compliance ────────────────────────────────────── */}
      <section className="border-t border-[#0F3D2E]/6 dark:border-white/6 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Also from Worktugal</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-3 mb-3">
              Free Portugal compliance check
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
              Most remote workers in Portugal miss a tax, visa, or social security step. Two minutes to find out if you are one of them.
            </p>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#10B981] hover:text-[#059669] transition-colors"
            >
              Run free diagnostic <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
