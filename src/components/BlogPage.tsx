import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Bell } from 'lucide-react';
import { Seo } from './Seo';

const UPCOMING = [
  'The 183-day rule: what it actually means for you in Portugal',
  'NIF vs NISS — the difference that costs people thousands',
  'How to actually get an AIMA appointment in 2026',
  'AT registration for freelancers: step-by-step',
  'Social security for remote workers: what Portugal really expects',
];

export function BlogPage() {
  return (
    <>
      <Seo
        title="Worktugal Journal — compliance guides for Portugal"
        description="Practical guides on Portugal tax residency, AIMA appointments, NIF registration, and compliance for remote workers and freelancers. Coming soon."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3 h-3" />
            The Worktugal Journal
          </span>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-4">
            Guides are on the way
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-12">
            We're writing practical, jargon-free guides for freelancers and remote workers navigating life in Portugal. No filler. Just what you actually need to know.
          </p>

          {/* Upcoming articles */}
          <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 p-6 sm:p-8 mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-5">Coming up</p>
            <ul className="space-y-4">
              {UPCOMING.map((title) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">{title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Notify CTA */}
          <div className="bg-[#0F3D2E] rounded-2xl p-8 text-center relative overflow-hidden mb-8">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="relative z-10">
              <Bell className="w-6 h-6 text-white/60 mx-auto mb-3" />
              <h2 className="text-lg font-black text-white mb-2">Get notified when we publish</h2>
              <p className="text-white/60 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                Follow the Worktugal channel on Telegram. Guides, compliance updates, and rule changes posted there first.
              </p>
              <a
                href="https://t.me/worktugal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#10B981] text-white px-7 py-3 rounded-xl text-sm font-bold hover:bg-[#059669] hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                Join the community
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Diagnostic nudge */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            In the meantime,{' '}
            <Link to="/diagnostic" className="text-[#0F3D2E] dark:text-[#10B981] font-semibold hover:underline">
              run your free compliance diagnostic
            </Link>
            {' '}to see where you stand today.
          </p>

        </motion.div>
      </div>
    </>
  );
}
