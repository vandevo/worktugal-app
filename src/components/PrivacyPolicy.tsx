import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Seo } from './Seo';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h2>
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">{children}</div>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <>
    <Seo
      title="Privacy Policy — Worktugal"
      description="How Worktugal collects, uses, and protects your personal data. GDPR compliant."
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
            <Shield className="w-4 h-4 text-[#0F3D2E] dark:text-[#10B981]" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">Legal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: March 2026</p>

        <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 p-6 sm:p-8">

          <Section title="Who we are">
            <p>Worktugal is an online platform providing compliance risk intelligence for freelancers and remote professionals living or planning to live in Portugal. We are not a law firm, tax firm, or accounting practice.</p>
            <p>Contact: <a href="mailto:hello@worktugal.com" className="text-[#0F3D2E] dark:text-[#10B981] hover:underline">hello@worktugal.com</a></p>
          </Section>

          <Section title="What data we collect">
            <p>We collect data you provide directly:</p>
            <ul className="space-y-1.5 mt-2">
              {[
                'Email address — to deliver your diagnostic results',
                'Display name — optional, to personalise your account',
                'Phone number — optional, only if you choose to provide it',
                'Diagnostic answers — to calculate your compliance risk profile',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#10B981] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">We also collect usage data automatically via Google Analytics (only with your consent): pages visited, session duration, referring source.</p>
          </Section>

          <Section title="How we use your data">
            <ul className="space-y-1.5">
              {[
                'Deliver your compliance diagnostic results',
                'Send compliance updates if you opted in',
                'Improve the diagnostic tool and content accuracy',
                'Maintain security and prevent abuse',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#10B981] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">We do not sell your data. We do not share it with third parties except as described below.</p>
          </Section>

          <Section title="Third parties">
            <p>We use the following services:</p>
            <ul className="space-y-1.5 mt-2">
              {[
                'Supabase — database and authentication (EU servers)',
                'Cloudflare Pages — hosting and CDN',
                'Google Analytics — usage analytics (consent required)',
                'Google OAuth — optional sign-in via Google account',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#10B981] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Your rights (GDPR)">
            <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, email us at <a href="mailto:hello@worktugal.com" className="text-[#0F3D2E] dark:text-[#10B981] hover:underline">hello@worktugal.com</a>.</p>
            <p>You may also withdraw marketing consent or delete your account from your My Account page.</p>
          </Section>

          <Section title="Cookies">
            <p>We use strictly necessary cookies for authentication and session management. Analytics cookies are only set with your explicit consent via the cookie banner. You can change your preferences at any time using the Cookie Settings link in the footer.</p>
          </Section>

          <Section title="Data retention">
            <p>Diagnostic results are retained for as long as your account exists. If you request deletion, we remove your data within 30 days. Anonymous aggregate data may be retained for statistical purposes.</p>
          </Section>

          <Section title="Changes to this policy">
            <p>We may update this policy from time to time. Material changes will be communicated via email. Continued use of the platform after changes constitutes acceptance.</p>
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
