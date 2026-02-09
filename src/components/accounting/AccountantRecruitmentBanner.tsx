import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountantRecruitmentBanner: React.FC = () => {
  return (
    <section className="py-24 bg-obsidian border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <Briefcase className="w-12 h-12 text-blue-500/50" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-serif text-white mb-4">
                Are you a certified accountant?
              </h3>
              <p className="text-lg text-gray-500 mb-2 font-light">
                Join our network and help foreign freelancers navigate Portuguese taxation.
              </p>
              <p className="text-sm text-gray-600 font-light">
                We connect you with pre-qualified clients. You set your availability. We handle payments.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                to="/accountants/apply"
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-black/20 border border-white/10"
              >
                Apply to Join
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
