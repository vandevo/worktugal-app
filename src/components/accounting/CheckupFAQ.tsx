import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Is this checkup really free?',
    answer: 'Yes, completely free. No credit card required, no hidden fees, no pressure to buy anything. We built this tool to help freelancers understand their situation before making expensive mistakes.'
  },
  {
    question: 'How accurate is the compliance score?',
    answer: 'The checkup is based on current Portuguese tax law as of 2025 and enhanced with insights from real user data. It assigns severity levels (critical/high/medium/low) to each issue, provides specific penalty amounts, and compares your situation to similar freelancers. However, it\'s a screening tool, not legal advice. For complex situations, speak with an accountant.'
  },
  {
    question: 'What makes this checkup "enhanced" and data-driven?',
    answer: 'Our system analyzes patterns from real user submissions to provide contextual guidance. For example, if you\'re a tax resident without NIF, you\'ll see the exact penalty (€375+), the deadline (60 days from arrival), and know that 67% of similar users had the same issue. This goes beyond generic checklists to give you actionable, prioritized guidance.'
  },
  {
    question: 'What happens to my data?',
    answer: 'Your answers are stored securely and never shared with third parties. We use the data only to generate your compliance report. You can request deletion at any time by emailing us.'
  },
  {
    question: 'Do I need a NIF to use this?',
    answer: 'No. The checkup helps you understand if and when you need to take action, including whether you need to get a NIF or register for tax purposes. It\'s designed for people at all stages.'
  },
  {
    question: 'What if my situation is complicated?',
    answer: 'The checkup handles most freelancer scenarios. If your situation is complex (multiple income streams, company structure, cross-border work), the results page will recommend speaking with an accountant and you can book a paid consultation.'
  },
  {
    question: 'Will I be spammed with emails?',
    answer: 'No. We only send your compliance report and occasional updates about Portuguese tax changes that affect freelancers. You can unsubscribe anytime. We don\'t sell your email to anyone.'
  },
  {
    question: 'Can I retake the checkup later?',
    answer: 'Yes. Your situation changes over time (income grows, you hire people, you cross thresholds). Come back anytime to check your compliance status again. It takes 3 minutes.'
  },
  {
    question: 'What if I already work with an accountant?',
    answer: 'Great! Use this checkup to verify that you\'re covering everything, or to prepare better questions for your accountant. Many freelancers discover gaps their current accountant missed.'
  }
];

export const CheckupFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Questions about the checkup
            </h2>
            <p className="text-lg text-gray-400">
              Everything you need to know before starting
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-blue-400/30 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.05] transition-colors"
              >
                <span className="text-base md:text-lg font-semibold text-white pr-8">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
