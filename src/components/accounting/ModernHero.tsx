import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-200 mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>AI-Powered Compliance Engine</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tight"
        >
          Verify your status.<br />
          <span className="text-white/60">Find your expert.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-400 mb-10 max-w-xl mx-auto"
        >
          The operating system for Portugal expats. Check your tax compliance in 3 minutes.
        </motion.p>

        {/* "Search" Input Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative group max-w-2xl mx-auto"
        >
          <div 
            onClick={handleSearchClick}
            className={`
              relative flex items-center w-full p-4 bg-[#1a1a1a] border rounded-2xl cursor-text transition-all duration-300 shadow-2xl
              ${isFocused ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-white/10 hover:border-white/20'}
            `}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
          >
            <div className="flex-shrink-0 mr-4 text-gray-500">
              <Search className="w-6 h-6" />
            </div>
            
            <div className="flex-grow text-left">
              <span className="text-gray-400 text-lg">Check my tax residency status...</span>
              {/* Animated cursor could go here */}
              <span className="inline-block w-0.5 h-5 ml-1 align-middle bg-blue-400/50 animate-pulse" />
            </div>

            <div className="flex-shrink-0 ml-4">
              <div className="bg-white/10 p-2 rounded-lg text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-200">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Actions / Suggestions */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <QuickAction 
              icon={<ShieldCheck className="w-4 h-4" />} 
              label="Compliance Checkup" 
              onClick={() => navigate('/checkup')} 
            />
            <QuickAction 
              icon={<UserCheck className="w-4 h-4" />} 
              label="Find an Accountant" 
              onClick={() => navigate('/partners')} 
            />
            <QuickAction 
              icon={<Sparkles className="w-4 h-4" />} 
              label="NHR 2.0 Status" 
              onClick={() => navigate('/checkup')} 
            />
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
};

const QuickAction = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-sm text-gray-400 hover:text-white transition-all duration-200"
  >
    {icon}
    <span>{label}</span>
  </button>
);
