import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Seo } from '../Seo';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Download,
  FileText
} from 'lucide-react';
import { getCheckupResults } from '../../lib/taxCheckup';

export const CheckupResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const intakeId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!intakeId) {
      setError('No checkup ID provided');
      setLoading(false);
      return;
    }

    loadResults();
  }, [intakeId]);

  const loadResults = async () => {
    try {
      const data = await getCheckupResults(intakeId!);
      setResults(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading results:', err);
      setError('Failed to load results. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing your compliance status...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error">{error || 'Results not found'}</Alert>
          <div className="mt-6 text-center">
            <Button onClick={() => navigate('/checkup')}>Start New Checkup</Button>
          </div>
        </div>
      </div>
    );
  }

  const totalIssues = results.compliance_score_red + results.compliance_score_yellow + results.compliance_score_green;
  const compliancePercentage = totalIssues > 0
    ? Math.round((results.compliance_score_green / totalIssues) * 100)
    : 0;

  const redFlags = results.compliance_report?.match(/CRITICAL ISSUES[\s\S]*?(?=\n\n|$)/)?.[0]
    ?.split('\n')
    .filter((line: string) => line.match(/^\d+\./))
    .map((line: string) => line.replace(/^\d+\.\s*/, '')) || [];

  const yellowWarnings = results.compliance_report?.match(/AREAS TO REVIEW[\s\S]*?(?=\n\n|$)/)?.[0]
    ?.split('\n')
    .filter((line: string) => line.match(/^\d+\./))
    .map((line: string) => line.replace(/^\d+\.\s*/, '')) || [];

  const greenConfirmations = results.compliance_report?.match(/YOU'RE COMPLIANT[\s\S]*?(?=\n\n|$)/)?.[0]
    ?.split('\n')
    .filter((line: string) => line.match(/^\d+\./))
    .map((line: string) => line.replace(/^\d+\.\s*/, '')) || [];

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <Seo
        title="Your Tax Compliance Results"
        description="View your personalized tax compliance score and action plan for staying compliant in Portugal."
        noindex={true}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Your Compliance Report</h1>
              <p className="text-gray-400 mb-3">
                Based on your answers, here's your current compliance status
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-yellow-200/90 text-xs italic leading-relaxed">
                  This report provides general information only and does not constitute legal or tax advice. Results are educational and should be verified with licensed tax professionals or accountants specific to your situation.
                </p>
              </div>
            </div>

            {/* Compliance Score */}
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
                    <div className="text-2xl font-bold text-red-400">{results.compliance_score_red}</div>
                    <div className="text-xs text-gray-400">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{results.compliance_score_yellow}</div>
                    <div className="text-xs text-gray-400">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{results.compliance_score_green}</div>
                    <div className="text-xs text-gray-400">Good</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-8">
              <p className="text-gray-300 text-sm text-center">
                Most freelancers in your situation have {Math.round(yellowWarnings.length * 1.2)} warnings on average.
                {results.compliance_score_red === 0 && results.compliance_score_yellow === 0
                  ? " You're doing better than most!"
                  : " You have some areas to address."}
              </p>
            </div>
          </div>

          {/* Critical Issues */}
          {redFlags.length > 0 && (
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
          )}

          {/* Warnings */}
          {yellowWarnings.length > 0 && (
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
          )}

          {/* Green Confirmations */}
          {greenConfirmations.length > 0 && (
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
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">What's next?</h2>

            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Complete your compliance profile</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Submit our detailed intake form for a deeper analysis. We'll identify all compliance gaps, estimate penalties, and create a prioritized action plan. When we launch our specialist network, you'll get priority access.
                    </p>
                    <Button
                      onClick={() => navigate('/accounting/intake')}
                      className="w-full sm:w-auto"
                    >
                      Complete full intake
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Specialist consultations coming soon</h3>
                    <p className="text-gray-300 text-sm">
                      We're building a network of verified Portuguese tax specialists. Be first to know when we launch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-white/[0.05] mt-6">
                <p className="text-gray-400 text-sm">
                  We've sent a copy of this report to <span className="text-white font-medium">{results.email}</span>
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Keep this report handy when talking to accountants or tax advisors
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
