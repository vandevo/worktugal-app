import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "I had no idea I was supposed to declare my freelance income quarterly. This checkup saved me from a huge fine.",
    author: "Sarah M.",
    role: "Graphic designer, Lisbon",
    avatar: "S"
  },
  {
    quote: "Finally someone explained the NIF vs. opening activity confusion. I was about to pay 500 EUR to an accountant just to get started.",
    author: "James K.",
    role: "Software developer, Porto",
    avatar: "J"
  },
  {
    quote: "The compliance score showed me exactly what I was missing. Turned out I crossed the VAT threshold 6 months ago and didn't know.",
    author: "Ana R.",
    role: "Content creator, Cascais",
    avatar: "A"
  }
];

export const ModernTestimonials: React.FC = () => {
  return (
    <section className="py-24 bg-obsidian border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-serif text-white sm:text-4xl mb-4"
          >
            Built by freelancers, for freelancers
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 font-light text-lg"
          >
            We've been through the confusion. Now we're helping others avoid it.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 p-8 flex flex-col h-full hover:border-white/10 transition-all duration-300"
            >
              <div className="mb-8">
                <div className="text-blue-500/50 text-4xl font-serif mb-4">"</div>
                <p className="text-gray-300 font-light italic leading-relaxed">
                  {t.quote}
                </p>
              </div>
              
              <div className="mt-auto flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-500">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{t.author}</div>
                  <div className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
