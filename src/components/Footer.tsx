import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Send, Linkedin, MessageCircle } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';

export const Footer: React.FC = () => {
  const { openConsentBanner } = useCookieConsent();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img
                src="/worktugal-logo-bg-light-radius-1000-1000.png"
                alt=""
                className="w-8 h-8 rounded-lg object-contain"
                width="32"
                height="32"
              />
              <span className="text-xl font-bold">Worktugal Pass</span>
            </a>
            <p className="text-gray-400 text-sm">
              Exclusive perks and benefits for remote professionals in Lisbon.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a></li>
              <li>
                <a 
                  href="https://www.linkedin.com/company/worktugal/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@worktugal.com" 
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <a 
                  href="mailto:hello@worktugal.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  hello@worktugal.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <a 
                  href="https://wa.me/351928090121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  +351 928 090 121
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Lisbon, Portugal</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <motion.a
                href="https://t.me/worktugal"
                aria-label="Worktugal Telegram channel"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Send className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/company/worktugal/"
                aria-label="Worktugal LinkedIn company page"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://chat.whatsapp.com/K06kCpDW0yLL6kzQ1ujtT5"
                aria-label="Join Worktugal WhatsApp community"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://worktugal.com/"
                aria-label="Visit main Worktugal website"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Globe className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500">&copy; 2025 Worktugal Pass. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
              <button
                onClick={openConsentBanner}
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
              >
                Manage Cookie Preferences
              </button>
              <span className="hidden sm:inline text-gray-600">•</span>
              <a 
                href="/privacy" 
                className="text-gray-500 hover:text-white transition-colors underline"
              >
                Privacy Policy
              </a>
              <span className="hidden sm:inline text-gray-600">•</span>
              <a 
                href="/terms" 
                className="text-gray-500 hover:text-white transition-colors underline"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};