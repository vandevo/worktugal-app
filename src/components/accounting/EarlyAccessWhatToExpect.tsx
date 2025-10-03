import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, CreditCard } from 'lucide-react';

export const EarlyAccessWhatToExpect: React.FC = () => {
  const timeline = [
    {
      icon: Mail,
      title: 'Join the Waitlist',
      time: 'Now',
      description: 'Tell us your situation - takes 60 seconds',
    },
    {
      icon: Calendar,
      title: 'Get Your Confirmation',
      time: 'Within 10 minutes',
      description: "Receive a checklist and what to expect next via email",
    },
    {
      icon: CreditCard,
      title: 'Book Your Slot',
      time: 'Within 48 hours',
      description: "We'll send you priority access to available booking slots",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            What to Expect
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Three simple steps to get priority access
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {timeline.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl md:rounded-3xl border border-white/[0.10] shadow-xl shadow-black/20 p-5 md:p-6 hover:border-blue-400/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex-shrink-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-3 border border-blue-400/30 shadow-lg">
                    <step.icon className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
                  </div>
                  <div className="flex-1 sm:flex-initial">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">{step.title}</h3>
                    <span className="inline-block text-xs md:text-sm font-semibold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/20">
                      {step.time}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm md:text-base mt-3 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
