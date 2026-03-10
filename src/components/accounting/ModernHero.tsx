import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_INSIGHTS } from '../../utils/taxCheckupEnhancements';

export const ModernHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden">

      {/* Background spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

      <div className="relative w-full max-w-2xl mx-auto text-center z-10">

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-xs font-medium text-gray-400">Updated for 2026 Regulations</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[9px] text-gray-600 uppercase tracking-widest font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>
              Verified against official sources:{' '}
              {new Date(USER_INSIGHTS.lastVerifiedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-6 text-white leading-[1.1]"
        >
          You might look compliant.{' '}
          <br className="hidden md:block" />
          But are you exposed?
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto text-lg md:text-xl text-gray-400 mb-10 font-light leading-relaxed"
        >
          Hidden compliance risks cost remote workers, freelancers, and expats in Portugal
          up to <span className="text-white font-medium">€3,750 in penalties</span>. Find
          yours in 3 minutes, free.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <button
            onClick={() => navigate('/diagnostic')}
            className="px-10 py-4 bg-white text-black hover:bg-gray-100 rounded-xl text-sm uppercase tracking-widest font-bold transition-all shadow-xl shadow-black/20 active:scale-95"
          >
            Check My Risk — Free (3 min)
          </button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-gray-600 font-medium"
        >
          <span>No credit card. No signup.</span>
          <span className="hidden sm:inline text-gray-700">·</span>
          <span>Legal citations included.</span>
          <span className="hidden sm:inline text-gray-700">·</span>
          <span>865 diagnostics completed.</span>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
};
