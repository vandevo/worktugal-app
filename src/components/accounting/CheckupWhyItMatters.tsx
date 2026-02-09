import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, FileX, Scale, TrendingUp } from 'lucide-react';

export const CheckupWhyItMatters: React.FC = () => {
  const risks = [
    {
      icon: AlertTriangle,
      title: 'Avoid fines from 500 to 5,000 EUR',
      description: 'Portuguese tax authorities (Financas) can issue heavy penalties for missing declarations, late filings, or incorrect activity codes. Updated for 2025: VAT-exempt freelancers must file quarterly turnover returns'
    },
    {
      icon: FileX,
      title: 'Stop ignoring letters you can\'t read',
      description: 'Those official envelopes from Financas aren\'t going away. Most freelancers miss critical deadlines because they don\'t understand Portuguese tax notices'
    },
    {
      icon: Scale,
      title: 'Discover first-year tax benefits',
      description: 'New freelancers under the Simplified Regime may qualify for a 50% coefficient reduction in year 1 (only 37.5% of service income taxed). Applies if you have no salary or pension income. Our checkup identifies if you may qualify and explains registration requirements'
    },
    {
      icon: TrendingUp,
      title: 'Prepare for growth without panic',
      description: 'When you cross the VAT threshold (15,000 EUR annual income) or approach the 200k organized accounting regime, you need to know what changes. Get specific deadlines and action steps based on your income level'
    }
  ];

  return (
    <section className="py-24 bg-obsidian border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-serif text-white mb-4">
              Why this matters
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
              Most freelancers in Portugal are missing something. Here's what you're avoiding.
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
              className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 p-8 hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <risk.icon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-serif text-white mb-3">
                    {risk.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">
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
          className="mt-12 p-8 bg-white/[0.01] rounded-2xl border border-white/5"
        >
          <p className="text-center text-gray-500 text-xs font-light leading-relaxed uppercase tracking-widest">
            <strong className="text-gray-400">The reality:</strong> Portugal's tax system is complex, especially for non-Portuguese speakers. Our compliance readiness checkup analyzes your situation against real freelancer data and provides specific guidance with penalty amounts, deadlines, and priority ranking. Updated for 2025. Takes 3 minutes.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
