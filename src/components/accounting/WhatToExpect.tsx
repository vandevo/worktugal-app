import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Mail, Calendar, Video, FileText, MessageCircle } from 'lucide-react';

export const WhatToExpect: React.FC = () => {
  const timeline = [
    {
      icon: CreditCard,
      title: 'Book & Pay',
      time: 'Now',
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
    <section className="py-24 bg-obsidian border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl font-serif text-white mb-4">
            What to expect
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto px-4 font-light">
            Here's exactly how it works
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
              className="bg-[#121212] backdrop-blur-3xl rounded-2xl md:rounded-3xl border border-white/5 shadow-xl shadow-black/20 p-6 md:p-8 hover:border-white/10 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="flex-shrink-0 bg-white/5 rounded-2xl p-4 border border-white/10">
                    <step.icon className="w-6 h-6 text-blue-500/50" />
                  </div>
                  <div className="flex-1 sm:flex-initial">
                    <h3 className="text-xl font-serif text-white mb-2">{step.title}</h3>
                    <span className="inline-block text-[10px] font-bold text-blue-500/50 bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10 uppercase tracking-widest">
                      {step.time}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-6 leading-relaxed font-light">
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
          className="mt-12 md:mt-16 bg-white/[0.01] rounded-2xl md:rounded-3xl border border-white/5 p-6 md:p-8"
        >
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span className="text-blue-500/50">ℹ</span>
            Important Notes
          </h4>
          <ul className="space-y-4">
            {[
              "You can reschedule your appointment up to 24 hours before the scheduled time via Cal.com",
              "Missed appointments without 24h notice cannot be refunded or rescheduled",
              "The €149 Annual Return Consult credit is automatically applied if you hire us for full filing",
              "Email support response times vary by service tier selected"
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-blue-500/50 mt-1 text-xs">•</span>
                <span className="text-xs text-gray-500 font-light uppercase tracking-widest leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
