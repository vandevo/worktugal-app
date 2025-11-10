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
  FileText,
  Sparkles,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Users
} from 'lucide-react';

export const CheckupResultsDemo: React.FC = () => {
  const navigate = useNavigate();
  const [feedbackGiven, setFeedbackGiven] = React.useState<Set<string>>(new Set());

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
              {redFlags.map((flag, index) => {
                const flagId = `demo-red-${index}`;
                const hasVoted = feedbackGiven.has(flagId);
                return (
                  <div key={index} className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-200 flex-1">{flag}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2 pt-3 border-t border-red-500/10">
                      <span className="text-xs text-gray-500 mr-2">Is this accurate?</span>
                      <button
                        onClick={() => setFeedbackGiven(prev => new Set(prev).add(flagId))}
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
                        onClick={() => setFeedbackGiven(prev => new Set(prev).add(flagId))}
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
                const flagId = `demo-yellow-${index}`;
                const hasVoted = feedbackGiven.has(flagId);
                return (
                  <div key={index} className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-gray-900 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-200 flex-1">{warning}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2 pt-3 border-t border-yellow-500/10">
                      <span className="text-xs text-gray-500 mr-2">Is this accurate?</span>
                      <button
                        onClick={() => setFeedbackGiven(prev => new Set(prev).add(flagId))}
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
                        onClick={() => setFeedbackGiven(prev => new Set(prev).add(flagId))}
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
            <h2 className="text-2xl font-bold text-white mb-6">What's next?</h2>

            <div className="space-y-4">
              <motion.div
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Coming Soon
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <h3 className="text-white font-semibold text-lg">Complete your compliance profile</h3>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-4">
                      Submit our detailed intake form for a deeper analysis. We'll identify all compliance gaps, estimate penalties, and create a prioritized action plan. When we launch, you'll get priority access.
                    </p>
                    <Button
                      disabled
                      className="w-full sm:w-auto opacity-60 cursor-not-allowed"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Get early access (launching soon)
                    </Button>
                    <p className="text-blue-300 text-xs mt-3 font-medium">
                      We'll notify you at {demoResults.email} when it's ready
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Coming Soon
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Calendar className="w-6 h-6 text-purple-400" />
                    <h3 className="text-white font-semibold text-lg">Specialist consultations</h3>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-3">
                      We're building a network of verified Portuguese tax specialists. Book 30-minute consultations to get expert guidance tailored to your situation.
                    </p>
                    <p className="text-purple-300 text-xs font-medium">
                      Launching in the next few weeks. You'll be first to know.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="text-center pt-4 border-t border-white/[0.05] mt-6">
                <p className="text-gray-400 text-sm">
                  We've sent a copy of this report to <span className="text-white font-medium">{demoResults.email}</span>
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Keep this report handy when talking to accountants or tax advisors
                </p>
              </div>
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
                This is our first version and we're continuously improving. Help us make this tool better for everyone.
              </p>
              <Button
                onClick={() => navigate('/checkup')}
                className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
              >
                Take the real checkup to report feedback
              </Button>
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
        </motion.div>
      </div>
    </div>
  );
};
