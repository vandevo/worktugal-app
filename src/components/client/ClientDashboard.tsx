import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { CaseTracker } from '../accounting/CaseTracker';
import { Button } from '../ui/Button';
import { Calendar, FileText, User } from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                My Dashboard
              </h1>
              <p className="text-gray-400">
                Track your accounting consultations and manage your tax services
              </p>
            </div>
            <Button onClick={() => window.location.href = '/accounting'}>
              Book New Consultation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/accounting"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → Book a consultation
                  </a>
                </li>
                <li>
                  <a
                    href="/accounting#faq"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → View FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/accounting#pricing"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → See pricing
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Resources</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://info.portaldasfinancas.gov.pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → Portal das Finanças ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.seg-social.pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → Segurança Social ↗
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-8 h-8 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Support</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Need help? Contact our support team.
              </p>
              <a
                href="mailto:hello@worktugal.com"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                hello@worktugal.com
              </a>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
            <CaseTracker />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
