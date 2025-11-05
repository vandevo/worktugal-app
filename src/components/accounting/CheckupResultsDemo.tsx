import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  FileText
} from 'lucide-react';

export const CheckupResultsDemo: React.FC = () => {
  const navigate = useNavigate();

  const demoResults = {
    name: 'John Doe',
    email: 'demo@example.com',
    compliance_score_red: 2,
    compliance_score_yellow: 3,
    compliance_score_green: 5
  };

  const redFlags = [
    'No NIF (Tax ID) registered - Required for all tax residents in Portugal',
    'Activity not opened with Portuguese tax authority - Working without proper registration'
  ];

  const yellowWarnings = [
    'No fiscal representative appointed - Recommended for non-Portuguese speakers',
    'Electronic notifications not activated - You may miss important tax deadlines',
    'No IBAN registered with tax authority - Required for refunds and payments'
  ];

  const greenConfirmations = [
    'You have a NISS (Social Security number) - Good for social contributions',
    'Spending more than 183 days in Portugal - Correctly identified as tax resident',
    'Income sources clearly identified - Helps with proper tax classification',
    'VAT regime appropriate for your activity level',
    'Recent arrival timeline documented - Good for NHR application if eligible'
  ];

  const totalIssues = demoResults.compliance_score_red + demoResults.compliance_score_yellow + demoResults.compliance_score_green;
  const compliancePercentage = Math.round((demoResults.compliance_score_green / totalIssues) * 100);

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Your Compliance Report</h1>
              <p className="text-gray-400">
                Based on your answers, here's your current compliance status
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="inline-block"
                >
                  <div className="text-6xl font-bold text-white mb-2">
                    {compliancePercentage}%
                  </div>
                </motion.div>
                <p className="text-xl text-gray-300">Compliant</p>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{demoResults.compliance_score_red}</div>
                    <div className="text-xs text-gray-400">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{demoResults.compliance_score_yellow}</div>
                    <div className="text-xs text-gray-400">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{demoResults.compliance_score_green}</div>
                    <div className="text-xs text-gray-400">Good</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-8">
              <p className="text-gray-300 text-sm text-center">
                Most freelancers in your situation have {Math.round(yellowWarnings.length * 1.2)} warnings on average.
                You have some areas to address.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-red-500/20 shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Critical Issues</h2>
                <p className="text-sm text-gray-400">Fix these immediately to avoid penalties</p>
              </div>
            </div>
            <div className="space-y-4">
              {redFlags.map((flag, index) => (
                <div key={index} className="flex gap-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-200 flex-1">{flag}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-yellow-500/20 shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Areas to Review</h2>
                <p className="text-sm text-gray-400">Address these to ensure full compliance</p>
              </div>
            </div>
            <div className="space-y-3">
              {yellowWarnings.map((warning, index) => (
                <div key={index} className="flex gap-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-gray-900 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-200 flex-1">{warning}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-green-500/20 shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">You're Compliant</h2>
                <p className="text-sm text-gray-400">Good work in these areas</p>
              </div>
            </div>
            <div className="space-y-3">
              {greenConfirmations.map((confirmation, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 flex-1">{confirmation}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>

            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Book a Free 15-Minute Consultation</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Get personalized guidance from a Portuguese tax specialist. We'll review your specific situation and create an action plan.
                    </p>
                    <Button
                      onClick={() => navigate('/accounting/checkout')}
                      className="w-full sm:w-auto"
                    >
                      Book Free Consultation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Complete Full Intake for Detailed Review</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Submit comprehensive information for a complete compliance audit and written recommendations.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/accounting/intake')}
                      className="w-full sm:w-auto"
                    >
                      Start Full Intake
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-400 text-sm mb-4">
                  We've sent a copy of this report to <span className="text-white font-medium">{demoResults.email}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
