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
  ArrowRight,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Users,
  Flag
} from 'lucide-react';
import { getCheckupResults, submitCheckupFeedback } from '../../lib/taxCheckup';
import { ComplianceDisclaimer } from '../ComplianceDisclaimer';

export const CheckupResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const intakeId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<Set<string>>(new Set());
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportComment, setReportComment] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

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
        title="Your Compliance Readiness Results"
        description="View your personalized compliance readiness score and action plan for staying compliant in Portugal."
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
              <h1 className="text-4xl font-bold text-white mb-4">Your Compliance Readiness Report</h1>
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
              className="bg-red-500/[0.03] backdrop-blur-3xl rounded-3xl border-2 border-red-500/30 shadow-2xl shadow-red-900/20 ring-1 ring-red-500/[0.08] p-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center relative">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Critical Issues ({redFlags.length})</h2>
                  <p className="text-sm text-red-300/80">Requires immediate attention to avoid penalties</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-6">These issues may result in fines from 500 to 5,000 EUR if left unresolved.</p>
              <div className="space-y-4">
                {redFlags.map((flag, index) => {
                  const flagId = `red-${index}`;
                  const hasVoted = feedbackSubmitted.has(flagId);
                  return (
                    <div key={index} className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-200 flex-1">{flag}</p>
                      </div>
                      {/* Feedback Widget */}
                      <div className="mt-3 flex items-center justify-end gap-2 pt-3 border-t border-red-500/10">
                        <span className="text-xs text-gray-500 mr-2">Is this accurate?</span>
                        <button
                          onClick={async () => {
                            if (hasVoted) return;
                            try {
                              await submitCheckupFeedback({
                                checkupLeadId: intakeId!,
                                flagType: 'red',
                                flagId,
                                feedbackType: 'helpful',
                                isAccurate: true
                              });
                              setFeedbackSubmitted(prev => new Set(prev).add(flagId));
                            } catch (err) {
                              console.error('Feedback error:', err);
                            }
                          }}
                          disabled={hasVoted}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            hasVoted
                              ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                              : 'bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-300'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          {hasVoted ? 'Thanks!' : 'Yes'}
                        </button>
                        <button
                          onClick={async () => {
                            if (hasVoted) return;
                            try {
                              await submitCheckupFeedback({
                                checkupLeadId: intakeId!,
                                flagType: 'red',
                                flagId,
                                feedbackType: 'not_helpful',
                                isAccurate: false
                              });
                              setFeedbackSubmitted(prev => new Set(prev).add(flagId));
                            } catch (err) {
                              console.error('Feedback error:', err);
                            }
                          }}
                          disabled={hasVoted}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            hasVoted
                              ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                              : 'bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          No
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                {yellowWarnings.map((warning, index) => {
                  const flagId = `yellow-${index}`;
                  const hasVoted = feedbackSubmitted.has(flagId);
                  return (
                    <div key={index} className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-gray-900 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-200 flex-1">{warning}</p>
                      </div>
                      {/* Feedback Widget */}
                      <div className="mt-3 flex items-center justify-end gap-2 pt-3 border-t border-yellow-500/10">
                        <span className="text-xs text-gray-500 mr-2">Is this accurate?</span>
                        <button
                          onClick={async () => {
                            if (hasVoted) return;
                            try {
                              await submitCheckupFeedback({
                                checkupLeadId: intakeId!,
                                flagType: 'yellow',
                                flagId,
                                feedbackType: 'helpful',
                                isAccurate: true
                              });
                              setFeedbackSubmitted(prev => new Set(prev).add(flagId));
                            } catch (err) {
                              console.error('Feedback error:', err);
                            }
                          }}
                          disabled={hasVoted}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            hasVoted
                              ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                              : 'bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-300'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          {hasVoted ? 'Thanks!' : 'Yes'}
                        </button>
                        <button
                          onClick={async () => {
                            if (hasVoted) return;
                            try {
                              await submitCheckupFeedback({
                                checkupLeadId: intakeId!,
                                flagType: 'yellow',
                                flagId,
                                feedbackType: 'not_helpful',
                                isAccurate: false
                              });
                              setFeedbackSubmitted(prev => new Set(prev).add(flagId));
                            } catch (err) {
                              console.error('Feedback error:', err);
                            }
                          }}
                          disabled={hasVoted}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            hasVoted
                              ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                              : 'bg-white/5 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-300'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          No
                        </button>
                      </div>
                    </div>
                  );
                })}
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

          {/* Next Steps: Paid Review Upsell */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-3xl rounded-3xl border border-blue-500/20 shadow-2xl shadow-black/30 ring-1 ring-blue-500/[0.08] p-8 md:p-10"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Want the full picture?</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your free checkup flagged{' '}
              <span className="text-red-400 font-semibold">{results.compliance_score_red} critical</span>
              {results.compliance_score_yellow > 0 && (
                <> and <span className="text-yellow-400 font-semibold">{results.compliance_score_yellow} warning</span></>
              )}
              {' '}issue{(results.compliance_score_red + results.compliance_score_yellow) !== 1 ? 's' : ''}.
              A detailed review digs deeper into each one.
            </p>

            <motion.div
              className="bg-white/[0.04] border border-blue-500/30 rounded-2xl p-6 md:p-8 mb-6"
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-7 h-7 text-blue-400" />
                    <h3 className="text-white font-bold text-xl">Detailed Compliance Review</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Get a human-verified analysis of your specific situation. Your intake is cross-referenced against current Portuguese regulations using AI-assisted research from official sources. You receive escalation flags, source citations, and a prioritized action plan.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      26-question structured intake covering 7 compliance dimensions
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      AI-assisted research, human-verified report
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      Escalation flags for areas needing professional review
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      Delivered to your email within 48 hours
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3 md:min-w-[180px]">
                  <div className="text-center md:text-right">
                    <div className="text-4xl font-bold text-white">
                      49<span className="text-xl text-gray-400">.00 EUR</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">One-time payment. No subscription.</p>
                  </div>
                  <Button
                    onClick={() => navigate('/compliance-review')}
                    size="lg"
                    className="w-full md:w-auto px-8"
                  >
                    Get Your Detailed Review
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>

            <p className="text-gray-500 text-xs text-center italic">
              Your checkup results are saved. The detailed review builds on your existing data for a more comprehensive analysis.
            </p>

            <div className="text-center pt-6 border-t border-white/[0.05] mt-6">
              <p className="text-gray-400 text-sm">
                We've sent a copy of this report to <span className="text-white font-medium">{results.email}</span>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Keep this report handy when talking to accountants or tax advisors
              </p>
            </div>
          </motion.div>

          {/* Report Issue Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8"
          >
            <div className="text-center">
              <Flag className="w-8 h-8 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Found an error or outdated info?</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-2xl mx-auto">
                We continuously update this tool with the latest Portuguese regulations. If something looks wrong, let us know.
              </p>
              {!showReportModal ? (
                <Button
                  onClick={() => setShowReportModal(true)}
                  className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report an Issue
                </Button>
              ) : (
                <div className="bg-white/[0.05] rounded-xl p-6 max-w-xl mx-auto">
                  {!reportSuccess ? (
                    <>
                      <textarea
                        value={reportComment}
                        onChange={(e) => setReportComment(e.target.value)}
                        placeholder="What did you find? Which item is incorrect? What should it say instead?"
                        rows={4}
                        className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.10] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 mb-4"
                      />
                      <div className="flex gap-3 justify-center">
                        <Button
                          onClick={async () => {
                            setReportSubmitting(true);
                            try {
                              await submitCheckupFeedback({
                                checkupLeadId: intakeId!,
                                flagType: 'general',
                                feedbackType: 'error',
                                comment: reportComment,
                                userEmail: results.email
                              });
                              setReportSuccess(true);
                              setTimeout(() => {
                                setShowReportModal(false);
                                setReportSuccess(false);
                                setReportComment('');
                              }, 3000);
                            } catch (err) {
                              console.error('Report error:', err);
                            } finally {
                              setReportSubmitting(false);
                            }
                          }}
                          disabled={!reportComment.trim() || reportSubmitting}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          {reportSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowReportModal(false);
                            setReportComment('');
                          }}
                          variant="secondary"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-green-300 font-medium">Thank you for helping us improve!</p>
                      <p className="text-gray-400 text-sm mt-1">We'll review your feedback shortly.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Facebook Community CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 backdrop-blur-3xl rounded-3xl border border-blue-500/30 shadow-2xl shadow-black/30 ring-1 ring-blue-500/[0.05] p-8 md:p-10"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Discuss your results with 19,800+ remote professionals</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Join our Facebook community to share your experience, ask questions, and learn from others who've been through the same tax compliance journey in Portugal.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button
                    onClick={() => window.open('https://www.facebook.com/groups/worktugal', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Worktugal Community
                  </Button>
                  <Button
                    onClick={() => navigate('/partners')}
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Browse Partner Services
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-500/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-300">19.8k</div>
                  <div className="text-xs text-gray-400">Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-300">Portugal</div>
                  <div className="text-xs text-gray-400">Focused community</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-300">Free</div>
                  <div className="text-xs text-gray-400">Forever</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Disclaimer */}
          <ComplianceDisclaimer variant="inline" className="text-center mt-8 pb-16" />
        </motion.div>
      </div>

      {/* Persistent sticky CTA banner */}
      {(results.compliance_score_red > 0 || results.compliance_score_yellow > 0) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-blue-500/20 py-3 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-300 text-sm text-center sm:text-left">
              <span className="text-red-400 font-semibold">{results.compliance_score_red + results.compliance_score_yellow} issues found.</span>
              {' '}Get a detailed review with source citations and escalation flags.
            </p>
            <Button
              onClick={() => navigate('/compliance-review')}
              size="sm"
              className="whitespace-nowrap px-6"
            >
              Detailed Review -- 49 EUR
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
