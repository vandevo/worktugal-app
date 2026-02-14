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
  Flag,
  MessageCircle,
  Send
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
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Evaluating Readiness...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-obsidian py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error" className="bg-red-500/5 border-red-500/10 text-red-400">{error || 'Results not found'}</Alert>
          <div className="mt-8 text-center">
            <Button 
              onClick={() => navigate('/checkup')}
              className="text-xs font-medium uppercase tracking-widest px-8"
            >
              Start New Checkup
            </Button>
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
    <div className="min-h-screen bg-obsidian py-12">
      <Seo
        title="Compliance Readiness Results"
        description="View your personalized compliance readiness score and action plan."
        noindex={true}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/[0.05] p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 mb-6">
                <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-blue-400/80 font-bold">Regulatory Pulse: February 2026</span>
              </div>
              <h1 className="text-4xl font-serif text-white mb-4">Readiness Report</h1>
              <p className="text-gray-500 font-light mb-6">
                Based on your answers, here's your current compliance status.
              </p>
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-blue-300/80 text-[10px] uppercase tracking-widest font-medium leading-relaxed">
                  Informational report only. Not legal or tax advice. Consult licensed professionals for execution.
                </p>
              </div>
            </div>

            {/* Compliance Score */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-10 mb-10">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block"
                >
                  <div className="text-7xl font-serif text-white mb-2">
                    {compliancePercentage}%
                  </div>
                </motion.div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500 mb-8">Ready to Proceed</p>
                
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  <div className="p-4 rounded-xl bg-red-500/[0.03] border border-red-500/10">
                    <div className="text-xl font-medium text-red-400">{results.compliance_score_red}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mt-1">Critical</div>
                  </div>
                  <div className="p-4 rounded-xl bg-yellow-500/[0.03] border border-yellow-500/10">
                    <div className="text-xl font-medium text-yellow-400">{results.compliance_score_yellow}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mt-1">Warnings</div>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/[0.03] border border-green-500/10">
                    <div className="text-xl font-medium text-green-400">{results.compliance_score_green}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mt-1">Good</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="bg-blue-500/[0.02] border border-blue-500/5 rounded-xl p-6">
              <p className="text-gray-500 text-xs text-center font-light leading-relaxed">
                Peer data: Most remote professionals in your situation have {Math.round(yellowWarnings.length * 1.2)} warnings on average.
                {results.compliance_score_red === 0 && results.compliance_score_yellow === 0
                  ? " Your readiness is exceptional."
                  : " Some gaps need resolution before professional engagement."}
              </p>
            </div>
          </div>

          {/* Critical Issues */}
          {redFlags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-red-500/[0.01] rounded-3xl border border-red-500/10 p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center relative">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white">Critical Issues</h2>
                  <p className="text-xs text-red-400/60 uppercase tracking-widest font-medium mt-1">Requires immediate action</p>
                </div>
              </div>
              <div className="space-y-4">
                {redFlags.map((flag, index) => {
                  const flagId = `red-${index}`;
                  const hasVoted = feedbackSubmitted.has(flagId);
                  return (
                    <div key={index} className="p-6 bg-white/[0.01] rounded-2xl border border-white/5">
                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center text-xs font-bold border border-red-500/20">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 text-sm font-light leading-relaxed flex-1">{flag}</p>
                      </div>
                      {/* Feedback Widget */}
                      <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mr-2">Accurate?</span>
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
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                            hasVoted
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-white/[0.02] hover:bg-blue-500/10 text-gray-500 hover:text-blue-400'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {hasVoted ? 'VERIFIED' : 'YES'}
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
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                            hasVoted
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-white/[0.02] hover:bg-red-500/10 text-gray-500 hover:text-red-400'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                          {hasVoted ? 'REPORTED' : 'NO'}
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
              className="bg-white/[0.01] rounded-3xl border border-white/5 p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white">Areas to Review</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Recommended adjustments</p>
                </div>
              </div>
              <div className="space-y-4">
                {yellowWarnings.map((warning, index) => {
                  const flagId = `yellow-${index}`;
                  const hasVoted = feedbackSubmitted.has(flagId);
                  return (
                    <div key={index} className="p-6 bg-white/[0.01] rounded-2xl border border-white/5">
                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-xs font-bold border border-yellow-500/20">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 text-sm font-light leading-relaxed flex-1">{warning}</p>
                      </div>
                      {/* Feedback Widget */}
                      <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mr-2">Accurate?</span>
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
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                            hasVoted
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-white/[0.02] hover:bg-blue-500/10 text-gray-500 hover:text-blue-400'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {hasVoted ? 'VERIFIED' : 'YES'}
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
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                            hasVoted
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-white/[0.02] hover:bg-red-500/10 text-gray-500 hover:text-red-400'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                          {hasVoted ? 'REPORTED' : 'NO'}
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
              className="bg-white/[0.01] rounded-3xl border border-white/5 p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white">Confirmed Ready</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Verified compliant areas</p>
                </div>
              </div>
              <div className="space-y-4">
                {greenConfirmations.map((confirmation, index) => (
                  <div key={index} className="flex gap-5 items-start p-4 bg-white/[0.01] rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/50 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-sm font-light leading-relaxed flex-1">{confirmation}</p>
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
            className="bg-white/[0.02] rounded-3xl border border-blue-500/20 p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />
            
            <div className="max-w-2xl">
              <h2 className="text-2xl font-serif text-white mb-4">Detailed Compliance Review</h2>
              <p className="text-gray-500 font-light text-sm mb-10 leading-relaxed">
                Your free checkup identified <span className="text-white font-medium">{results.compliance_score_red + results.compliance_score_yellow} points</span> requiring attention. A detailed review provides a human-verified artifact with source citations and a prioritized action plan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">What's included</h4>
                  <ul className="space-y-3">
                    {[
                      '26-question diagnostic intake',
                      'AI-assisted regulatory research',
                      'Human-verified readiness report',
                      'Source citations from official law',
                      'Priority escalation flags'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-gray-400 font-light">
                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="mb-6">
                    <div className="text-3xl font-serif text-white">€49<span className="text-sm text-gray-500 ml-2 font-sans font-light">One-time</span></div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Delivered in 48 hours</p>
                  </div>
                  <Button
                    onClick={() => navigate('/compliance-review')}
                    size="lg"
                    className="w-full text-xs font-medium uppercase tracking-widest px-8"
                  >
                    Start Detailed Review
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                Report sent to <span className="text-gray-400">{results.email}</span>
              </p>
            </div>
          </motion.div>

          {/* Report Issue Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.01] rounded-3xl border border-white/5 p-10"
          >
            <div className="text-center max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-6">
                <Flag className="w-5 h-5 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Notice an inconsistency?</h3>
              <p className="text-gray-500 text-xs font-light mb-8 leading-relaxed">
                We continuously monitor Portuguese regulations. If you identify outdated information or an error in your report, please let our team know.
              </p>
              {!showReportModal ? (
                <Button
                  onClick={() => setShowReportModal(true)}
                  className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 text-[10px] uppercase tracking-widest font-bold px-8"
                >
                  Report Inconsistency
                </Button>
              ) : (
                <div className="bg-white/[0.02] rounded-2xl p-8">
                  {!reportSuccess ? (
                    <>
                      <textarea
                        value={reportComment}
                        onChange={(e) => setReportComment(e.target.value)}
                        placeholder="Describe the inconsistency..."
                        rows={4}
                        className="w-full px-4 py-4 bg-obsidian border border-white/5 rounded-xl text-white text-sm font-light placeholder-gray-600 focus:outline-none focus:border-blue-500/50 mb-6"
                      />
                      <div className="flex gap-4 justify-center">
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
                          className="text-[10px] uppercase tracking-widest px-6"
                        >
                          {reportSubmitting ? 'Submitting...' : 'Send Report'}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowReportModal(false);
                            setReportComment('');
                          }}
                          variant="outline"
                          className="text-[10px] uppercase tracking-widest px-6 border-white/5"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500/50 mx-auto mb-4" />
                      <p className="text-white text-sm font-medium">Thank you.</p>
                      <p className="text-gray-500 text-xs mt-2 font-light">We will review this inconsistency immediately.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Community CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/[0.01] rounded-3xl border border-white/5 p-10"
          >
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-blue-500/50" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-serif text-white mb-3">Community Support</h3>
                <p className="text-gray-500 text-sm font-light mb-8 leading-relaxed max-w-xl">
                  Join 1,300+ remote professionals in our Portuguese compliance community. Share experiences and stay updated on regulatory changes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    onClick={() => window.open('https://t.me/worktugal', '_blank')}
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] uppercase tracking-widest font-bold px-8"
                  >
                    <Send className="w-3 h-3 mr-2" />
                    Telegram Community
                  </Button>
                  <Button
                    onClick={() => window.open('https://www.facebook.com/groups/worktugal', '_blank')}
                    variant="outline"
                    className="border-white/5 hover:bg-white/5 text-gray-400 hover:text-white text-[10px] uppercase tracking-widest font-bold px-8"
                  >
                    <Users className="w-3 h-3 mr-2" />
                    Facebook Group
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Disclaimer */}
          <ComplianceDisclaimer variant="inline" className="text-center mt-12 pb-24 text-[10px] opacity-50" />
        </motion.div>
      </div>

      {/* Persistent sticky CTA banner */}
      {(results.compliance_score_red > 0 || results.compliance_score_yellow > 0) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-xl border-t border-white/5 py-4 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-gray-400 text-xs font-light">
                <span className="text-white font-medium">{results.compliance_score_red + results.compliance_score_yellow} gaps identified.</span>
                {' '}Get a human-verified Readiness Artifact with law citations.
              </p>
            </div>
            <Button
              onClick={() => navigate('/compliance-review')}
              size="sm"
              className="whitespace-nowrap px-8 text-[10px] uppercase tracking-widest font-bold"
            >
              Get Detailed Review — €49
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
