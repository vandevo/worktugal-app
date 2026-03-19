import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_ITEMS = [
  {
    q: 'Is the diagnostic really free?',
    a: 'Yes. No credit card, no hidden fees. Your full results are shown immediately — Setup Score, Exposure Index, every compliance trap detected, legal citations, penalty ranges, and official source links. Nothing is locked.',
  },
  {
    q: 'How does the scoring work?',
    a: 'Two scores are calculated. Your Setup Score (0–100) measures how well your tax, visa, and registration setup is structured. Your Exposure Index (0–100) measures how many known compliance traps apply to your situation. Both are based on declarative rules verified against Portuguese law as of 2026.',
  },
  {
    q: 'What are compliance traps?',
    a: 'Traps are specific risks that catch people off guard — dual tax residency if you never deregistered abroad (CIRS Art. 16), VAT misclassification if you crossed the income threshold (CIVA Art. 29), or unfiled IRS returns with penalties from €150 to €3,750. Each trap includes the legal basis and a source URL you can verify yourself.',
  },
  {
    q: 'What if my situation is complicated?',
    a: 'The diagnostic covers most freelancer, remote worker, and expat scenarios. If your setup involves multiple income streams, a company structure, or cross-border complexity, the results page will flag the specific risks that apply and suggest next steps.',
  },
  {
    q: 'What happens to my data?',
    a: 'Your answers are stored securely and never sold or shared with third parties. We use them only to generate your risk profile and, if you opted in, to send relevant compliance updates. You can request deletion at any time.',
  },
  {
    q: 'Will I be spammed with emails?',
    a: 'No. We send your results and only follow up if Portuguese rules change in a way that directly affects your situation. You control consent during the diagnostic — and can unsubscribe any time.',
  },
];

export const CheckupFAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Common questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Everything you need to know before running your diagnostic.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-[#161618] border-[#0F3D2E]/20 dark:border-[#10B981]/20 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
                    : 'bg-white dark:bg-[#161618] border-[#0F3D2E]/8 dark:border-white/8 hover:border-[#0F3D2E]/15 dark:hover:border-white/12'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className={`text-sm font-bold pr-6 transition-colors ${
                    isOpen
                      ? 'text-[#0F3D2E] dark:text-[#10B981]'
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {item.q}
                  </span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isOpen
                      ? 'bg-[#0F3D2E] text-white dark:bg-[#10B981]'
                      : 'bg-slate-100 dark:bg-white/8 text-slate-400 dark:text-slate-500'
                  }`}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-400 dark:text-slate-500 mt-10"
        >
          Still have a question?{' '}
          <a
            href="mailto:hello@worktugal.com"
            className="text-[#0F3D2E] dark:text-[#10B981] font-semibold hover:underline"
          >
            Email us
          </a>{' '}
          or{' '}
          <Link
            to="/diagnostic"
            className="text-[#0F3D2E] dark:text-[#10B981] font-semibold hover:underline"
          >
            just run the diagnostic
          </Link>.
        </motion.p>

      </div>
    </section>
  );
};
