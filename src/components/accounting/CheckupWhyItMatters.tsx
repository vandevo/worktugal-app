import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, FileX, Scale, TrendingUp } from 'lucide-react';

export const CheckupWhyItMatters: React.FC = () => {
  const risks = [
    {
      icon: AlertTriangle,
      title: 'Avoid fines from €500 to €5,000',
      description: 'Portuguese tax authorities (Finanças) can issue heavy penalties for missing declarations, late filings, or incorrect activity codes. NEW 2025: VAT-exempt freelancers must now file quarterly turnover returns'
    },
    {
      icon: FileX,
      title: 'Stop ignoring letters you can\'t read',
      description: 'Those official envelopes from Finanças aren\'t going away. Most freelancers miss critical deadlines because they don\'t understand Portuguese tax notices'
    },
    {
      icon: Scale,
      title: 'Discover first-year tax benefits',
      description: 'New freelancers under the Simplified Regime may qualify for a 50% coefficient reduction in year 1 (only 37.5% of service income taxed). Applies if you have no salary or pension income. Our checkup identifies if you may qualify and explains registration requirements'
    },
    {
      icon: TrendingUp,
      title: 'Prepare for growth without panic',
      description: 'When you cross the VAT threshold (€15,000 annual income) or approach €200k organized accounting regime, you need to know what changes. Get specific deadlines and action steps based on your income level'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-850 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why this matters
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Most freelancers in Portugal are missing something. Here's what you're avoiding
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {risks.map((risk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-red-400/10 p-6 hover:border-red-400/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-400/20 flex items-center justify-center">
                    <risk.icon className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {risk.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {risk.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-blue-400/20"
        >
          <p className="text-center text-gray-300 text-sm leading-relaxed">
            <strong className="text-blue-300">The reality:</strong> Portugal's tax system is complex, especially for non-Portuguese speakers. Our enhanced checkup analyzes your situation against real freelancer data and provides specific guidance with penalty amounts, deadlines, and priority ranking. Covers 8 critical 2025 rules including the NEW quarterly VAT return requirement. Takes 3 minutes, could save you thousands.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
