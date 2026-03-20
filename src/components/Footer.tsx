import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, Linkedin } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';

export const Footer: React.FC = () => {
  const { openConsentBanner } = useCookieConsent();

  return (
    <footer className="bg-[#0F3D2E] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ── Main grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <img
                src="/worktugal-logo-bg-light-radius-1000-1000.png"
                alt="Worktugal"
                className="w-8 h-8 object-contain rounded-lg"
                width="32"
                height="32"
              />
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:opacity-80 transition-opacity">
                Worktugal
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-5">
              Compliance risk intelligence for freelancers and remote professionals living in Portugal.
            </p>
            <p className="text-white/30 text-[11px] leading-relaxed max-w-sm">
              Not a law firm, tax firm, or accounting practice. Content is for informational and educational purposes only. Always consult a licensed professional for advice specific to your situation.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Platform</p>
            <ul className="space-y-3">
              {[
                { label: 'Diagnostic', to: '/diagnostic' },
                { label: 'Changelog', to: '/changelog' },
                { label: 'Blog', to: '/blog' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Connect */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Contact</p>
            <ul className="space-y-3 mb-5">
              <li>
                <Link to="/contact" className="text-sm text-white/50 hover:text-white transition-colors">
                  Get in touch
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@worktugal.com"
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  hello@worktugal.com
                </a>
              </li>
            </ul>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Connect</p>
            <div className="flex gap-2">
              <a
                href="https://t.me/worktugal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/worktugal/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/30">&copy; 2026 Worktugal. Built for clarity.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={openConsentBanner}
              className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
            >
              Cookie Settings
            </button>
            <Link to="/privacy" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
