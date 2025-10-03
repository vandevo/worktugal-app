import { motion } from 'framer-motion';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountantRecruitmentBanner: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-t border-white/[0.10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-400/30">
                <Briefcase className="w-12 h-12 text-blue-400" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold text-white mb-3">
                Are You an OCC-Certified Accountant?
              </h3>
              <p className="text-xl text-gray-300 mb-2">
                Join our network and help expats navigate Portuguese taxation.
              </p>
              <p className="text-gray-400">
                We connect you with pre-qualified clients. You set your availability. We handle payments.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                to="/join-accountants"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-500/90 to-blue-600/90 hover:from-blue-400/90 hover:to-blue-500/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-500/40 hover:shadow-2xl border border-blue-400/30"
              >
                Apply to Join
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
