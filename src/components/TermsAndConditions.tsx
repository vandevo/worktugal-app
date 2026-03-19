import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Seo } from './Seo';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h2>
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">{children}</div>
  </div>
);

export const TermsAndConditions: React.FC = () => (
  <>
    <Seo
      title="Terms of Service — Worktugal"
      description="Terms and conditions for using the Worktugal compliance diagnostic platform."
    />
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0F3D2E] dark:hover:text-white transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#0F3D2E]/8 dark:bg-[#10B981]/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#0F3D2E] dark:text-[#10B981]" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">Legal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: March 2026</p>

        <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 p-6 sm:p-8">

          <Section title="What Worktugal is">
            <p>Worktugal is an informational platform that provides compliance risk diagnostics for freelancers and remote professionals in Portugal. We are not a law firm, accounting firm, or licensed tax advisor.</p>
            <p>All content, scores, and recommendations are for educational and informational purposes only. Nothing on this platform constitutes legal, tax, or immigration advice. Always consult a licensed professional before making decisions.</p>
          </Section>

          <Section title="Eligibility">
            <p>You must be at least 18 years old to use this platform. By using Worktugal, you confirm that all information you provide is accurate to the best of your knowledge.</p>
          </Section>

          <Section title="Your account">
            <p>You are responsible for maintaining the security of your account. Do not share your credentials. Notify us immediately at <a href="mailto:hello@worktugal.com" className="text-[#0F3D2E] dark:text-[#10B981] hover:underline">hello@worktugal.com</a> if you suspect unauthorized access.</p>
          </Section>

          <Section title="Acceptable use">
            <p>You agree not to:</p>
            <ul className="space-y-1.5 mt-2">
              {[
                'Use the platform for any unlawful purpose',
                'Attempt to reverse-engineer, scrape, or copy diagnostic algorithms',
                'Submit false or misleading information',
                'Interfere with platform availability or security',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Intellectual property">
            <p>All content, design, and diagnostic logic on this platform is owned by Worktugal. You may not reproduce, distribute, or create derivative works without written permission.</p>
          </Section>

          <Section title="Limitation of liability">
            <p>Worktugal provides diagnostic results on an "as is" basis. We make no warranties about the accuracy, completeness, or suitability of any information for your specific situation.</p>
            <p>We are not liable for any losses, penalties, or damages arising from your use of — or reliance on — information provided by this platform. Always verify with a qualified professional.</p>
          </Section>

          <Section title="Termination">
            <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting us.</p>
          </Section>

          <Section title="Governing law">
            <p>These terms are governed by the laws of Portugal and the European Union. Any disputes shall be resolved in the courts of Lisbon, Portugal.</p>
          </Section>

          <Section title="Changes to these terms">
            <p>We may update these terms from time to time. We will notify you of material changes via email. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
          </Section>

        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Questions?{' '}
          <a href="mailto:hello@worktugal.com" className="text-[#0F3D2E] dark:text-[#10B981] hover:underline">
            hello@worktugal.com
          </a>
        </p>

      </motion.div>
    </div>
  </>
);
