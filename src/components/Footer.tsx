import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Linkedin, MessageCircle } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';

export const Footer: React.FC = () => {
  const { openConsentBanner } = useCookieConsent();

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <a href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity w-fit">
              <img
                src="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
                alt="Worktugal Logo"
                className="w-8 h-8 object-contain grayscale brightness-125"
                width="32"
                height="32"
              />
              <span className="text-xl font-medium tracking-tight text-white">Worktugal</span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              The compliance readiness layer for foreign freelancers and remote workers in Portugal.
            </p>
            <div className="pt-4">
              <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-widest font-medium mb-3">
                Legal Disclaimer
              </p>
              <p className="text-[11px] text-gray-600 leading-relaxed font-light">
                Worktugal provides informational resources and readiness verification only. We are not a law firm, tax firm, or accounting practice. Content is for research and educational purposes. Always consult licensed professionals for legal, tax, or immigration advice specific to your situation.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-light">
              <li>
                <a
                  href="/checkup"
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                >
                  Tax Checkup
                </a>
              </li>
              <li>
                <a
                  href="/compliance-review"
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                >
                  Detailed Review
                </a>
              </li>
              <li>
                <a
                  href="/accountants/apply"
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                >
                  For Accountants
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/changelog"
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-6">Contact</h4>
            <div className="space-y-4 text-sm font-light">
              <div className="flex items-center space-x-3 text-gray-500">
                <Mail className="h-4 w-4 text-gray-600" />
                <a
                  href="mailto:hello@worktugal.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  hello@worktugal.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <Phone className="h-4 w-4 text-gray-600" />
                <a
                  href="tel:+351215818485"
                  className="hover:text-white transition-colors duration-200"
                >
                  +351 215 818 485
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span>Lisbon, Portugal</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-6">Connect</h4>
            <div className="flex space-x-4">
              <motion.a
                href="https://t.me/worktugal"
                aria-label="Worktugal Telegram"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/5"
              >
                <Send className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/company/worktugal/"
                aria-label="Worktugal LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/5"
              >
                <Linkedin className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://chat.whatsapp.com/K06kCpDW0yLL6kzQ1ujtT5"
                aria-label="Worktugal WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/5"
              >
                <MessageCircle className="h-4 w-4" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 text-xs font-light">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-600">&copy; 2025 Worktugal. Built for readiness.</p>
            <div className="flex items-center gap-8">
              <button
                onClick={openConsentBanner}
                className="text-gray-600 hover:text-gray-400 transition-colors duration-200"
              >
                Cookie Settings
              </button>
              <a
                href="/privacy"
                className="text-gray-600 hover:text-gray-400 transition-colors duration-200"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="text-gray-600 hover:text-gray-400 transition-colors duration-200"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
