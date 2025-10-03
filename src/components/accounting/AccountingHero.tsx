import { motion } from 'framer-motion';
import { Calendar, FileCheck, Shield } from 'lucide-react';

interface AccountingHeroProps {
  onBookNow: () => void;
}

export const AccountingHero: React.FC<AccountingHeroProps> = ({ onBookNow }) => {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiMyMzY1YzQiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Worktugal Accounting Desk
          </h1>
          <p className="text-2xl sm:text-3xl text-blue-200 mb-4 font-medium">
            We don't sell NIF. We get you tax ready.
          </p>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Prepaid consults. Clear outcomes. No surprises.<br />
            Book a real accountant this week.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <Calendar className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Book This Week</h3>
            <p className="text-gray-300 text-sm">Get a slot with a real OCC-certified accountant within 7 days</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <FileCheck className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Written Outcomes</h3>
            <p className="text-gray-300 text-sm">Every consult includes a written note with next steps</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <Shield className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Fixed Prices</h3>
            <p className="text-gray-300 text-sm">Clear pricing upfront, no hidden fees or surprises</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={onBookNow}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
          >
            Book a Consult
          </button>
        </motion.div>
      </div>
    </section>
  );
};
