import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Clock, Globe, Search, Building2, Scale, Users, ChevronDown } from 'lucide-react';
import { Seo } from '../Seo';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const FAQ_ITEMS = [
  {
    q: 'Where does the data come from?',
    a: 'Official Portuguese government sources: Diário da República (the official gazette), AIMA, Portal das Finanças, and Segurança Social. Every alert links directly to the official publication.',
  },
  {
    q: 'Is this legal advice?',
    a: 'No. We provide factual summaries of regulatory changes with links to official sources. The AI-assisted summaries are clearly labeled. Always verify with the official publication or your legal counsel.',
  },
  {
    q: 'What practice areas are covered?',
    a: 'Immigration law, tax law, labor law, and golden visa regulations. You can filter alerts by your specific practice area.',
  },
  {
    q: 'How is this different from checking Diário da República myself?',
    a: 'The Diário da República publishes 100+ items per day, most irrelevant to immigration practice. We filter, summarize, and deliver only what matters to your clients. You save hours per week.',
  },
  {
    q: 'What happens after the Founding Member period?',
    a: 'Founding Members lock in €29/mo for life. After the first 10 spots, the price increases to €49/mo. No grandfathering for late joiners.',
  },
];

const FaqAccordion: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
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
  );
};

const FEATURES = [
  {
    icon: Clock,
    title: 'Real-time alerts',
    desc: 'Changes to immigration, tax, and labor law detected within hours of publication in the Diário da República.',
  },
  {
    icon: Globe,
    title: 'Official sources only',
    desc: 'Every alert links directly to the official government publication. No speculation, no third-party interpretation.',
  },
  {
    icon: Search,
    title: 'Searchable archive',
    desc: 'Every regulatory change since 2026, indexed and searchable. "What changed in NHR rules?" answered in seconds.',
  },
  {
    icon: Shield,
    title: 'Liability protection',
    desc: '"I checked Compliance Watch on Tuesday, the rule hadn\'t changed." A defensible position against malpractice claims.',
  },
];

const AUDIENCES = [
  {
    icon: Scale,
    title: 'Immigration lawyers',
    desc: 'Stop manually checking Diário da República. Get filtered alerts for your practice areas: immigration, tax, labor, golden visa.',
  },
  {
    icon: Building2,
    title: 'Relocation firms',
    desc: 'Stay ahead of rule changes that affect your clients\' visas, tax residency, and AIMA appointments. One source, all updates.',
  },
  {
    icon: Users,
    title: 'HR departments',
    desc: 'Managing employees in Portugal? Know when work permits, social security, or tax obligations change before your team is affected.',
  },
];

export const ComplianceLanding: React.FC = () => {
  return (
    <>
      <Seo
        title="Worktugal Compliance: Real-time Portugal regulatory intelligence for professionals"
        description="Track immigration, tax, and labor law changes in Portugal. Sourced from official government publications. Built for immigration lawyers, relocation firms, and HR departments."
        ogTitle="Worktugal Compliance: Portugal regulatory intelligence"
        ogDescription="Real-time alerts on Portugal law changes. Official sources. AI summaries. Searchable archive. €29/mo for Founding Members."
        ogImage="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
        ogType="website"
        ogUrl="https://app.worktugal.com/compliance"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Where does the data come from?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Official Portuguese government sources: Diário da República (the official gazette), AIMA, Portal das Finanças, and Segurança Social. Every alert links directly to the official publication.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is this legal advice?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. We provide factual summaries of regulatory changes with links to official sources. The AI-assisted summaries are clearly labeled. Always verify with the official publication or your legal counsel.',
              },
            },
            {
              '@type': 'Question',
              name: 'What practice areas are covered?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Immigration law, tax law, labor law, and golden visa regulations. You can filter alerts by your specific practice area.',
              },
            },
            {
              '@type': 'Question',
              name: 'How is this different from checking Diário da República myself?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Diário da República publishes 100+ items per day, most irrelevant to immigration practice. We filter, summarize, and deliver only what matters to your clients. You save hours per week.',
              },
            },
            {
              '@type': 'Question',
              name: 'What happens after the Founding Member period?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Founding Members lock in €29/mo for life. After the first 10 spots, the price increases to €49/mo. No grandfathering for late joiners.',
              },
            },
          ],
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left: copy */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center self-start text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
              FOUNDING MEMBER: €29/MO FOR LIFE
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
              Portugal compliance intelligence{' '}
              <span className="text-slate-900/30 dark:text-white/25">for professionals.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Real-time alerts on immigration, tax, and labor law changes. Sourced from official government publications. Built for lawyers, relocation firms, and HR teams.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
              href="mailto:hello@worktugal.com?subject=Founding Member: Compliance Intelligence"
                className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-7 py-4 rounded-xl text-base font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Become a Founding Member <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-4 text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-[#0F3D2E]/5 dark:hover:bg-white/5 rounded-xl transition-all"
              >
                See how it works
              </a>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              First 10 spots. Launch in 2 weeks. Cancel anytime.
            </p>
          </motion.div>

          {/* Right: preview cards */}
          <motion.div
            className="lg:col-span-5 relative flex items-center justify-center min-h-[320px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow blob */}
            <div className="absolute inset-0 bg-[#0F3D2E]/5 dark:bg-[#10B981]/5 rounded-full blur-[80px]" />

            <div className="relative w-full max-w-sm flex flex-col gap-5">
              {/* Alert card 1 */}
              <div
                className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-[#0F3D2E]/10 dark:border-white/8 p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] translate-x-[-8%] hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                    Immigration
                  </span>
                  <span className="text-[10px] text-slate-400">24 Apr 2026</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  AIMA appointment system changes
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  New online booking portal replaces in-person scheduling. Affects all D7, D8, and family reunion applicants.
                </p>
                <a href="https://diariodarepublica.pt" className="text-xs text-[#10B981] font-semibold mt-2 inline-block hover:underline">
                  View official source →
                </a>
              </div>

              {/* Alert card 2 */}
              <div
                className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-[#0F3D2E]/10 dark:border-white/8 p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] translate-x-[12%] hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                    Tax
                  </span>
                  <span className="text-[10px] text-slate-400">22 Apr 2026</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  NHR replacement rules updated
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  IFICI eligibility criteria expanded. New 10-year regime now covers remote workers with foreign employers.
                </p>
                <a href="https://diariodarepublica.pt" className="text-xs text-[#10B981] font-semibold mt-2 inline-block hover:underline">
                  View official source →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Social proof bar ─────────────────────────────────────── */}
      <div className="border-y border-[#0F3D2E]/5 dark:border-white/5 py-8 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 opacity-70">
            {[
              'Sourced from Diário da República',
              'AI-assisted summaries',
              'Official source links',
            ].map((item, i) => (
              <React.Fragment key={item}>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                  {item}
                </span>
                {i < 2 && (
                  <span className="hidden md:block w-1.5 h-1.5 bg-[#0F3D2E]/20 dark:bg-white/20 rounded-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Who it's for ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
            WHO IT'S FOR
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 mb-4">
            Built for professionals who can't afford to miss a change.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            If your clients' visas, tax status, or legal compliance depend on knowing when Portuguese law changes, this is for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {AUDIENCES.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 p-8 rounded-2xl border border-[#0F3D2E]/5 dark:border-white/5 bg-white dark:bg-[#161618] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all"
              >
                <div className="w-12 h-12 bg-[#0F3D2E]/5 dark:bg-[#10B981]/10 text-[#0F3D2E] dark:text-[#10B981] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{a.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{a.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-slate-50 dark:bg-white/[0.02]">
        <div className="text-center mb-12">
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 mb-4">
            From official source to your inbox in hours.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'We monitor',
              desc: 'Official RSS feeds from Diário da República, AIMA, Portal das Finanças, and Seg-Social, checked every 6 hours.',
            },
            {
              step: '2',
              title: 'AI summarizes',
              desc: '"What changed" + "Who this affects" + "Deadline", in English, grounded in the official source text.',
            },
            {
              step: '3',
              title: 'You get alerted',
              desc: 'Weekly digest email filtered by your practice areas. Every alert links to the official government publication.',
            },
            {
              step: '4',
              title: 'You search',
              desc: 'Full archive of every change since 2026. Search by keyword, date, or category. Never miss a rule change again.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3"
            >
              <span className="text-4xl font-black text-[#0F3D2E]/20 dark:text-[#10B981]/20">{item.step}</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 p-8 rounded-2xl border border-[#0F3D2E]/5 dark:border-white/5 bg-white dark:bg-[#161618] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all"
              >
                <div className="w-12 h-12 bg-[#0F3D2E]/5 dark:bg-[#10B981]/10 text-[#0F3D2E] dark:text-[#10B981] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Pricing / Founding Member ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-[#0F3D2E] rounded-2xl p-12 md:p-20 text-center flex flex-col items-center gap-8 relative overflow-hidden">
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <motion.h2
            {...fadeUp}
            className="text-3xl md:text-5xl font-black text-white relative z-10 leading-tight"
          >
            Founding Member: €29/mo for life.
          </motion.h2>
          <p className="text-[#10B981]/80 text-lg md:text-xl max-w-2xl relative z-10 leading-relaxed">
            First 10 spots. Weekly digest + searchable archive + direct source links. Launch in 2 weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <a
              href="mailto:hello@worktugal.com?subject=Founding Member: Compliance Intelligence"
              className="bg-[#10B981] text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-[#059669] hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl shadow-black/20"
            >
              Become a Founding Member
            </a>
            <a
              href="mailto:hello@worktugal.com?subject=Questions about Compliance Intelligence"
              className="border border-white/20 text-white px-10 py-5 rounded-xl text-lg font-bold hover:bg-white/10 transition-all"
            >
              Ask a question
            </a>
          </div>
          <p className="text-sm text-white/40 relative z-10">
            No credit card. No commitment. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
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
            Everything you need to know before joining Compliance Watch.
          </p>
        </motion.div>

        <FaqAccordion />
      </section>
    </>
  );
};
