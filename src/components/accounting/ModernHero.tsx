import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_INSIGHTS } from '../../utils/taxCheckupEnhancements';

export const ModernHero: React.FC = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchClick = () => {
    // Navigate to the checkup form as the primary "search" action
    navigate('/checkup');
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
      
      {/* Background Ambience - "Spotlight" effect similar to Perplexity/OpenAI */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

      <div className="relative w-full max-w-3xl mx-auto text-center z-10">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            <span className="text-xs font-medium text-gray-400">Updated for 2026 Regulations</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[9px] text-gray-600 uppercase tracking-widest font-bold">
            <span>Verified against official sources: {new Date(USER_INSIGHTS.lastVerifiedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-8 text-white leading-[1.1]"
        >
          Are you tax compliant <br className="hidden md:block"/> in Portugal?
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 font-light leading-relaxed"
        >
          Stop unverified decisions. Verify your compliance status in 3 minutes before engaging with systems that punish mistakes later.
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <button
            onClick={() => navigate('/checkup')}
            className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-black/20"
          >
            Free Checkup (3 min)
          </button>
          <button
            onClick={() => navigate('/compliance-review')}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs uppercase tracking-widest font-bold transition-all"
          >
            Detailed Review (49 EUR)
          </button>
        </motion.div>

        {/* "Search" Input Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto relative group search-container"
        >
          <div className="search-aura"></div>
          <div 
            onClick={handleSearchClick}
            className={`
              relative bg-[#0F0F0F] rounded-xl border shadow-2xl transition-all duration-300 overflow-hidden cursor-text
              ${isFocused ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-white/10 hover:border-white/20'}
            `}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
          >
            <div className="flex flex-col p-1">
              <div className="w-full bg-transparent border-0 text-xl text-white placeholder-gray-500 focus:ring-0 resize-none p-5 font-light text-left min-h-[80px] flex items-center">
                Check my tax compliance status...
                {/* Animated cursor */}
                <span className="inline-block w-0.5 h-6 ml-1 bg-blue-500 animate-pulse"></span>
              </div>
              
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <div className="p-2 text-gray-500 hover:text-white transition-colors rounded-md hover:bg-white/5">
                    {/* Paperclip Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </div>
                  <div className="p-2 text-gray-500 hover:text-white transition-colors rounded-md hover:bg-white/5">
                    {/* Mic Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  </div>
                </div>
                <button className="h-8 w-8 flex items-center justify-center bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions / Suggestions */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Take 3 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-600" />
              <span>Legal source verified</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Protect your residence status</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
};
