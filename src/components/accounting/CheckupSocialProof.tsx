import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const CheckupSocialProof: React.FC = () => {
  const testimonials = [
    {
      quote: "I had no idea I was supposed to declare my freelance income quarterly. This checkup saved me from a huge fine.",
      author: "Sarah M.",
      role: "Graphic designer, Lisbon"
    },
    {
      quote: "Finally someone explained the NIF vs. opening activity confusion. I was about to pay €500 to an accountant just to get started.",
      author: "James K.",
      role: "Software developer, Porto"
    },
    {
      quote: "The compliance score showed me exactly what I was missing. Turned out I crossed the VAT threshold 6 months ago and didn't know.",
      author: "Ana R.",
      role: "Content creator, Cascais"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built by freelancers, for freelancers
            </h2>
            <p className="text-lg text-gray-400">
              We've been through the confusion. Now we're helping others avoid it.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-blue-400/20 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-blue-400 mb-4 opacity-50" />
              <p className="text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="text-white font-semibold text-sm">
                  {testimonial.author}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
