import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Mail, Calendar, Video, FileText, MessageCircle } from 'lucide-react';

export const WhatToExpect: React.FC = () => {
  const timeline = [
    {
      icon: CreditCard,
      title: 'Book & Pay',
      time: 'When available',
      description: 'Choose your service and pay upfront. Clear pricing, no hidden fees.',
    },
    {
      icon: Mail,
      title: 'Confirmation Email',
      time: 'Within minutes',
      description: 'Receive booking confirmation with next steps and preparation tips.',
    },
    {
      icon: Calendar,
      title: 'Schedule Your Time',
      time: 'Within 7 days',
      description: 'Use your Cal.com link to book a specific appointment slot that works for you.',
    },
    {
      icon: Video,
      title: 'Your Consult',
      time: 'Scheduled time',
      description: 'Video or phone call with your OCC-certified accountant. Bring your questions.',
    },
    {
      icon: FileText,
      title: 'Written Outcome',
      time: 'Within 48 hours',
      description: 'Detailed note with your situation, recommendations, and action checklist.',
    },
    {
      icon: MessageCircle,
      title: 'Follow-up Support',
      time: 'As needed',
      description: 'Reach out with quick questions. Need ongoing help? We\'ll connect you with the right accountant.',
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
            Once booking opens, here's exactly how it works
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 md:mt-12 bg-white/[0.02] backdrop-blur-xl rounded-2xl md:rounded-3xl border border-blue-400/20 p-5 md:p-6"
        >
          <h4 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">ℹ</span>
            Important Notes
          </h4>
          <ul className="space-y-3 text-gray-300 text-sm md:text-base">
            <li className="flex items-start gap-3 leading-relaxed">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span>You can reschedule your appointment up to 24 hours before the scheduled time via Cal.com</span>
            </li>
            <li className="flex items-start gap-3 leading-relaxed">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span>Missed appointments without 24h notice cannot be refunded or rescheduled</span>
            </li>
            <li className="flex items-start gap-3 leading-relaxed">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span>Credits and pricing details will be provided when booking opens</span>
            </li>
            <li className="flex items-start gap-3 leading-relaxed">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span>Email support times will vary by service tier</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
