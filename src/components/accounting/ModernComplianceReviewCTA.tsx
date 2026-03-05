import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ClipboardList, Mail, Shield } from 'lucide-react';

export const ModernComplianceReviewCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-obsidian border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
            How it works
          </h2>
          
          <p className="text-lg text-gray-500 mb-16 font-light leading-relaxed max-w-2xl mx-auto">
            Answer 12 questions. Get your risk profile. See what you missed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <ClipboardList className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-blue-400/60 font-bold mb-3">Step 1</div>
              <h3 className="text-white text-sm font-serif mb-2">Answer the diagnostic</h3>
              <p className="text-gray-600 text-xs font-light leading-relaxed">12 questions about your visa, tax, and business setup. Takes 3 minutes.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-blue-400/60 font-bold mb-3">Step 2</div>
              <h3 className="text-white text-sm font-serif mb-2">Get your risk profile</h3>
              <p className="text-gray-600 text-xs font-light leading-relaxed">See your Setup Score, Exposure Index, and which compliance traps apply to you.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-blue-400/60 font-bold mb-3">Step 3</div>
              <h3 className="text-white text-sm font-serif mb-2">Fix what matters</h3>
              <p className="text-gray-600 text-xs font-light leading-relaxed">Get corrective actions, document checklists, and source citations for each risk.</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/diagnostic')}
            className="px-10 py-4 bg-white text-black hover:bg-gray-200 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-black/20 inline-flex items-center gap-2"
          >
            Start Free Diagnostic
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
