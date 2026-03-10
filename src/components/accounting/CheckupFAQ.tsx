import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Is the diagnostic really free?',
    answer:
      'Yes. No credit card, no hidden fees. All results are shown for free — including your Setup Score, Exposure Index, triggered compliance traps, legal citations, penalty ranges, and official source links. Nothing is locked.',
  },
  {
    question: 'How does the scoring work?',
    answer:
      'The diagnostic uses a dual-scoring engine. Your Setup Score (0–100) measures how well your tax, visa, and registration setup is configured. Your Exposure Index (0–100) measures how many known compliance traps apply to your situation. Both scores are calculated against declarative rules verified against Portuguese law as of 2026.',
  },
  {
    question: 'What are compliance traps?',
    answer:
      'Traps are specific regulatory risks that catch people off guard. Examples: dual tax residency if you never deregistered abroad (CIRS Art. 16), VAT misclassification if you crossed the annual income threshold (CIVA Art. 29), or unfiled IRS returns with penalties from €150 to €3,750. Each trap includes the legal basis and official source URL so you can verify it yourself.',
  },
  {
    question: 'What happens to my data?',
    answer:
      'Your answers are stored securely and never shared with third parties. We use the data only to generate your risk profile. You can request deletion at any time by emailing us.',
  },
  {
    question: 'What if my situation is complicated?',
    answer:
      'The diagnostic handles most freelancer, remote worker, and expat scenarios. If your situation involves multiple income streams, a company structure, or cross-border complexity, the results page will flag the specific risks that apply and recommend next steps — including a 30-minute clarity call if your case needs a human review.',
  },
  {
    question: 'Will I be spammed with emails?',
    answer:
      'No. We send your risk results and only contact you if Portuguese compliance rules change in a way that directly affects your situation. You can unsubscribe at any time. We never sell your email.',
  },
];

export const CheckupFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-obsidian border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Common questions
            </h2>
            <p className="text-base text-gray-500 font-light">
              Everything you need to know before running your diagnostic.
            </p>
          </motion.div>
        </div>

        <div className="space-y-3">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-base font-medium text-gray-200 pr-8">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
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
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 font-light leading-relaxed text-sm">
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
