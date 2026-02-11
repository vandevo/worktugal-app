import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Shield, Clock, ArrowRight, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface CheckupHeroProps {
  onStartCheckup: () => void;
}

export const CheckupHero: React.FC<CheckupHeroProps> = ({ onStartCheckup }) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-obsidian via-surface-dark to-blue-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiMyMzY1YzQiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-block">
            <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Compliance Readiness for Remote Professionals</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Are you tax compliant<br />in Portugal?
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-4 max-w-3xl mx-auto leading-relaxed">
            Find out in 3 minutes with our free compliance checkup -- or get a detailed review for full clarity
          </p>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Updated for 2025 with current Portuguese tax rules. See your compliance score, discover risks, and get your action plan.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Button
              onClick={onStartCheckup}
              size="lg"
              className="px-10 py-4 text-lg"
            >
              Free Checkup (3 min)
            </Button>
            <Button
              onClick={() => navigate('/compliance-review')}
              size="lg"
              variant="secondary"
              className="px-10 py-4 text-lg bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <FileText className="w-5 h-5 mr-2" />
              Detailed Review (49 EUR)
            </Button>
          </div>

          <p className="text-xs text-blue-200/80 mb-6 max-w-2xl mx-auto italic">
            This tool provides general information only and does not constitute legal or tax advice. Results are educational and should be verified with licensed professionals.
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-blue-300 font-medium"
          >
            Join <strong>hundreds of freelancers</strong> who've checked their compliance readiness
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <Clock className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Takes 3 minutes</h3>
            <p className="text-gray-300 text-sm">Quick questions about your work and residency status</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <FileCheck className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Instant results</h3>
            <p className="text-gray-300 text-sm">See your compliance score and prioritized action items</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <Shield className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Free, no commitment</h3>
            <p className="text-gray-300 text-sm">No credit card. Upgrade to a detailed review only if you want</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
