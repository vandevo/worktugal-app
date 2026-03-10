import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const risks = [
  {
    penalty: 'Up to €3,750',
    title: 'Unfiled IRS returns',
    description:
      'Lived in Portugal over 183 days and never filed Modelo 3? You are required to declare worldwide income. Penalties for late filing start at €150 and climb to €3,750.',
    color: 'text-red-400',
    border: 'border-red-500/15',
    bg: 'bg-red-500/[0.03]',
  },
  {
    penalty: 'Backdated VAT',
    title: 'VAT misclassification',
    description:
      'Crossed the annual income threshold and never registered for IVA? Backdated VAT plus penalties apply from the month you exceeded the limit — not from when you discovered it.',
    color: 'text-orange-400',
    border: 'border-orange-500/15',
    bg: 'bg-orange-500/[0.03]',
  },
  {
    penalty: 'Double taxation',
    title: 'Dual tax residency trap',
    description:
      'Registered as a Portuguese tax resident but never formally deregistered in your home country? You may owe taxes in both simultaneously under CIRS Art. 16.',
    color: 'text-yellow-400',
    border: 'border-yellow-500/15',
    bg: 'bg-yellow-500/[0.03]',
  },
  {
    penalty: 'Arrears + lost benefits',
    title: 'Social security gaps',
    description:
      'Freelancers must register for NISS and pay monthly contributions. Missed payments accrue interest, build debt, and suspend your access to public healthcare and future benefits.',
    color: 'text-purple-400',
    border: 'border-purple-500/15',
    bg: 'bg-purple-500/[0.03]',
  },
];

export const ModernFeatures: React.FC = () => {
  return (
    <section className="py-24 bg-obsidian border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-serif text-white sm:text-4xl mb-4"
          >
            The risks that cost people the most
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-light text-base max-w-xl mx-auto"
          >
            Our diagnostic checks your setup against 6 known compliance traps in Portuguese law.
            Most people discover them too late.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {risks.map((risk, i) => (
            <motion.div
              key={risk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border ${risk.border} ${risk.bg} p-7`}
            >
              <div className={`text-2xl font-serif font-medium mb-2 ${risk.color}`}>
                {risk.penalty}
              </div>
              <h3 className="text-white text-base font-medium mb-2">{risk.title}</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                {risk.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mt-8 p-4 rounded-xl bg-blue-900/10 border border-blue-500/15 flex items-center justify-center gap-3 text-center"
        >
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-200 font-light">
            <span className="font-medium text-blue-100">Every risk is source-cited.</span>{' '}
            Legal basis, penalty ranges, and official source URLs are included in your free results.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
