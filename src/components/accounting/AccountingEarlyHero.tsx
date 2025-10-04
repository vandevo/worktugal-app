import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileCheck, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

interface AccountingEarlyHeroProps {
  onJoinWaitlist: () => void;
}

export const AccountingEarlyHero: React.FC<AccountingEarlyHeroProps> = ({ onJoinWaitlist }) => {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiMyMzY1YzQiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-block">
            <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Worktugal Accounting Desk</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Got your NIF.<br />Now what?
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-4 max-w-3xl mx-auto leading-relaxed">
            Freelancing in Portugal but not sure if you're doing it right?<br />
            Got a letter from Financas you can't read?
          </p>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Talk to an OCC-certified accountant. Get guidance on your tax situation. Starting from €59.
          </p>

          <Button
            onClick={onJoinWaitlist}
            size="lg"
            className="mb-6 px-12 py-4 text-lg"
          >
            Join Early Access List
          </Button>

          <p className="text-sm text-blue-300 font-medium">
            Join the waitlist. We'll notify you when slots open. No commitment required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <Calendar className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Clear Guidance</h3>
            <p className="text-gray-300 text-sm">Get help understanding your tax obligations</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <FileCheck className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Written Action Plan</h3>
            <p className="text-gray-300 text-sm">Know exactly what to do next, no confusion</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <Shield className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">OCC-Certified Pros</h3>
            <p className="text-gray-300 text-sm">Real Portuguese accountants who speak English</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
