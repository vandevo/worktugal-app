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
    <div className="min-h-screen bg-obsidian py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Your compliance report</h1>
              <p className="text-lg text-gray-500 font-light">
                Based on your answers, here's your current status
              </p>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="inline-block"
                >
                  <div className="text-7xl font-serif text-white mb-2">
                    {compliancePercentage}%
                  </div>
                </motion.div>
                <p className="text-xs text-gray-600 uppercase tracking-[0.2em] font-bold">Readiness Score</p>
                <div className="mt-8 flex justify-center gap-12">
                  <div className="text-center">
                    <div className="text-2xl font-serif text-red-500/60">{demoResults.compliance_score_red}</div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-serif text-yellow-500/60">{demoResults.compliance_score_yellow}</div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-serif text-emerald-500/60">{demoResults.compliance_score_green}</div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Good</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/[0.02] border border-blue-500/10 rounded-xl p-6">
              <p className="text-gray-500 text-xs text-center font-light leading-relaxed uppercase tracking-widest">
                Most freelancers in your situation have {Math.round(yellowWarnings.length * 1.2)} warnings on average.
                You have some areas to address.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500/60" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-white">Critical issues</h2>
                <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">Fix immediately to avoid penalties</p>
              </div>
            </div>
            <div className="space-y-4">
              {redFlags.map((flag, index) => {
                const flagId = `demo-red-${index}`;
                const hasVoted = feedbackGiven.has(flagId);
                return (
                  <div key={index} className="p-6 bg-white/[0.01] rounded-2xl border border-white/5">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 text-red-500/60 border border-red-500/20 flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-400 font-light leading-relaxed flex-1">{flag}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                      <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mr-2">Is this accurate?</span>
                      <button
                        onClick={() => setFeedbackGiven(prev => new Set(prev).add(flagId))}
                        disabled={hasVoted}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                          hasVoted
                            ? 'bg-emerald-500/10 text-emerald-500/60 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-emerald-500/5 text-gray-600 hover:text-emerald-500/60 border border-white/5'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {hasVoted ? 'Thanks!' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setFeedbackGiven(prev => new Set(prev).add(flagId))}
                        disabled={hasVoted}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                          hasVoted
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-red-500/5 text-gray-600 hover:text-red-500/60 border border-white/5'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
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
            className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-500/60" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-white">Areas to review</h2>
                <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">Ensure full compliance</p>
              </div>
            </div>
            <div className="space-y-4">
              {yellowWarnings.map((warning, index) => {
                const flagId = `demo-yellow-${index}`;
                const hasVoted = feedbackGiven.has(flagId);
                return (
                  <div key={index} className="p-6 bg-white/[0.01] rounded-2xl border border-white/5">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-500/60 border border-yellow-500/20 flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-400 font-light leading-relaxed flex-1">{warning}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                      <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mr-2">Is this accurate?</span>
                      <button
                        onClick={() => setFeedbackGiven(prev => new Set(prev).add(flagId))}
                        disabled={hasVoted}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                          hasVoted
                            ? 'bg-emerald-500/10 text-emerald-500/60 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-emerald-500/5 text-gray-600 hover:text-emerald-500/60 border border-white/5'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {hasVoted ? 'Thanks!' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setFeedbackGiven(prev => new Set(prev).add(flagId))}
                        disabled={hasVoted}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                          hasVoted
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-red-500/5 text-gray-600 hover:text-red-500/60 border border-white/5'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
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
            className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500/60" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-white">You're compliant</h2>
                <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">Good work in these areas</p>
              </div>
            </div>
            <div className="space-y-4">
              {greenConfirmations.map((confirmation, index) => (
                <div key={index} className="flex gap-4 items-start p-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500/50 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-500 font-light leading-relaxed flex-1">{confirmation}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 md:p-12"
          >
            <h2 className="text-2xl font-serif text-white mb-8">What's next?</h2>

            <div className="space-y-6">
              <motion.div
                className="bg-white/[0.01] border border-white/5 rounded-2xl p-8"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <FileText className="w-6 h-6 text-blue-500/50" />
                      <h3 className="text-white font-serif text-xl">Complete your profile</h3>
                    </div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 text-gray-500 text-[10px] font-bold rounded-full border border-white/10 uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-blue-500/50" />
                      Coming Soon
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
                      Submit our detailed intake form for a deeper analysis. We'll identify all compliance gaps, estimate penalties, and create a prioritized action plan.
                    </p>
                    <Button
                      disabled
                      className="w-full sm:w-auto opacity-50 text-[10px] uppercase tracking-widest font-bold"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Early access
                    </Button>
                    <p className="text-blue-500/50 text-[10px] mt-4 uppercase tracking-widest font-bold">
                      We'll notify you at {demoResults.email}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/[0.01] border border-white/5 rounded-2xl p-8"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-6 h-6 text-purple-500/50" />
                      <h3 className="text-white font-serif text-xl">Specialist consultations</h3>
                    </div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 text-gray-500 text-[10px] font-bold rounded-full border border-white/10 uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-purple-500/50" />
                      Coming Soon
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                      We're building a network of verified Portuguese tax specialists. Book 30-minute consultations to get expert guidance tailored to your situation.
                    </p>
                    <p className="text-purple-500/50 text-[10px] mt-4 uppercase tracking-widest font-bold">
                      Launching in the next few weeks
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 md:p-12"
          >
            <div className="text-center">
              <Flag className="w-8 h-8 text-orange-500/50 mx-auto mb-6" />
              <h3 className="text-xl font-serif text-white mb-4">Found an error or outdated info?</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
                This is our first version and we're continuously improving. Help us make this tool better for everyone.
              </p>
              <Button
                onClick={() => navigate('/checkup')}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] uppercase tracking-widest font-bold px-8 h-12"
              >
                Report Feedback
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-500/50" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-serif text-white mb-4">Discuss your results with 19,800+ members</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed mb-8">
                  Join our community to share your experience, ask questions, and learn from others who've been through the same journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    onClick={() => window.open('https://www.facebook.com/groups/worktugal', '_blank')}
                    className="bg-white text-black hover:bg-gray-200 text-[10px] uppercase tracking-widest font-bold px-8 h-12"
                  >
                    Join Community
                  </Button>
                  <Button
                    onClick={() => navigate('/partners')}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] uppercase tracking-widest font-bold px-8 h-12"
                  >
                    Browse Partners
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-xl font-serif text-white mb-1">19.8k</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Members</div>
                </div>
                <div>
                  <div className="text-xl font-serif text-white mb-1">Portugal</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Focused</div>
                </div>
                <div>
                  <div className="text-xl font-serif text-white mb-1">Free</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Forever</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
