import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '865', label: 'Diagnostics completed' },
  { value: '6', label: 'Compliance traps checked' },
  { value: '€3,750', label: 'Max penalty exposure caught' },
  { value: '3 min', label: 'Average completion time' },
];

export const ModernTestimonials: React.FC = () => {
  return (
    <section className="py-20 bg-obsidian border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold mb-10"
        >
          Built on real data, verified against official sources
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] rounded-2xl border border-white/5 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <div className="text-3xl md:text-4xl font-serif text-white mb-2">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold leading-relaxed">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
