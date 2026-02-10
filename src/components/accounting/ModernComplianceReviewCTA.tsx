import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export const ModernComplianceReviewCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-obsidian border-t border-white/5 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-500/50" />
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Compliance Readiness Layer</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
            Ready to check your compliance?
          </h2>
          
          <p className="text-lg text-gray-500 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            Start free in 3 minutes, or go straight to a detailed review with escalation flags and source citations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkup')}
              className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2"
            >
              Free Checkup (3 min)
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/compliance-review')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2"
            >
              Detailed Review (49 EUR)
              <FileText className="w-4 h-4 text-white/50" />
            </motion.button>
          </div>

                  <div className="mt-16 pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <ShieldCheck className="w-5 h-5 text-emerald-500/50" />
                      </div>
                      <h3 className="text-white text-sm font-serif mb-2">Evidence-backed legal citations</h3>
                      <p className="text-gray-600 text-[10px] font-light uppercase tracking-[0.2em]">Cross-referenced results</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <FileText className="w-5 h-5 text-blue-500/50" />
                      </div>
                      <h3 className="text-white text-sm font-serif mb-2">Reveal hidden penalty risks</h3>
                      <p className="text-gray-600 text-[10px] font-light uppercase tracking-[0.2em]">Evidence-backed findings</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <Sparkles className="w-5 h-5 text-purple-500/50" />
                      </div>
                      <h3 className="text-white text-sm font-serif mb-2">Ready for professional review</h3>
                      <p className="text-gray-600 text-[10px] font-light uppercase tracking-[0.2em]">AI-assisted triage</p>
                    </div>
                  </div>
        </motion.div>
      </div>
    </section>
  );
};
