import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllApplications, updateApplicationStatus, createAccountantProfile, approveApplicationAndCreateAccount } from '../../lib/accountants';
import { getSignedUrl } from '../../lib/storage';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { AdminNavigation } from './AdminNavigation';
import { CheckCircle, XCircle, Clock, Award, Briefcase, Mail, Phone, Calendar, Eye, FileText, Copy, Check } from 'lucide-react';
import type { AccountantApplication } from '../../types/accountant';

export const AccountantApplicationReview: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<AccountantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getAllApplications();
      if (fetchError) throw fetchError;
      if (data) setApplications(data);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndCreateAccount = async (application: AccountantApplication) => {
    if (!confirm(`Create account for ${application.full_name}?\n\nThis will:\n- Create Supabase auth account\n- Set standard password: Worktugal2025!\n- Create accountant profile\n- Mark application as accepted`)) return;

    setProcessingId(application.id);
    setError(null);

    try {
      const result = await approveApplicationAndCreateAccount(application, user?.id || 'admin');

      if (result.success && result.email && result.password) {
        setCredentials({ email: result.email, password: result.password });
        await loadApplications();
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      console.error('Error creating account:', err);
      setError('Failed to create account');
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReject = async (applicationId: number) => {
    const notes = adminNotes[applicationId];
    if (!notes || notes.trim() === '') {
      setError('Please provide rejection notes');
      return;
    }

    if (!confirm('Reject this application? This cannot be undone.')) return;

    setProcessingId(applicationId);
    setError(null);

    try {
      await updateApplicationStatus(applicationId, 'rejected', notes, 'admin');
      await loadApplications();
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError('Failed to reject application');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: AccountantApplication['status']) => {
    const config = {
      pending: { variant: 'warning' as const, label: 'Pending Review' },
      approved: { variant: 'success' as const, label: 'Approved' },
      rejected: { variant: 'error' as const, label: 'Rejected' },
    };
    const { variant, label } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const pendingApplications = applications.filter(a => a.status === 'pending');
  const reviewedApplications = applications.filter(a => a.status !== 'pending');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <AdminNavigation />
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

      <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-yellow-400" />
          Pending Applications ({pendingApplications.length})
        </h2>

        {pendingApplications.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-400">No pending applications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApplications.map((application) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-white/[0.08] rounded-xl overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(expandedId === application.id ? null : application.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{application.full_name}</h3>
                        {getStatusBadge(application.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {application.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {application.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {application.experience_years} years experience
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Applied {formatDate(application.created_at)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expandedId === application.id ? null : application.id);
                      }}
                    >
                      {expandedId === application.id ? '▼' : '▶'}
                    </button>
                  </div>
                </div>

                {expandedId === application.id && (
                  <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Specializations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {application.specializations.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-full text-xs"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {application.certifications && application.certifications.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Certifications</h4>
                        <div className="space-y-2">
                          {application.certifications.map((cert, idx) => (
                            <div key={idx} className="text-sm text-gray-400">
                              <span className="font-medium text-white">{cert.name}</span> #{cert.number}
                              {cert.expiry && ` • Expires: ${cert.expiry}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">About</h4>
                      <p className="text-sm text-gray-400">{application.bio}</p>
                    </div>

                    {(application.resume_url || application.linkedin_url) && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Documents & Links</h4>
                        <div className="flex gap-3">
                          {application.resume_url && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  if (application.resume_path) {
                                    const signedUrl = await getSignedUrl(application.resume_path);
                                    window.open(signedUrl, '_blank');
                                  } else {
                                    window.open(application.resume_url, '_blank');
                                  }
                                } catch (err) {
                                  console.error('Error opening resume:', err);
                                  setError('Failed to load resume. Please try again.');
                                }
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                            >
                              <Eye className="w-4 h-4" />
                              <FileText className="w-4 h-4" />
                              View Resume
                            </button>
                          )}
                          {application.linkedin_url && (
                            <a
                              href={application.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.10] text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200"
                            >
                              LinkedIn ↗
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Admin Notes
                      </label>
                      <textarea
                        value={adminNotes[application.id] || ''}
                        onChange={(e) => setAdminNotes(prev => ({
                          ...prev,
                          [application.id]: e.target.value
                        }))}
                        rows={3}
                        placeholder="Add notes about this application..."
                        className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => handleApproveAndCreateAccount(application)}
                        disabled={processingId === application.id}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {processingId === application.id ? 'Creating Account...' : 'Approve & Create Account'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(application.id)}
                        disabled={processingId === application.id}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {reviewedApplications.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Reviewed Applications ({reviewedApplications.length})
          </h2>
          <div className="space-y-3">
            {reviewedApplications.map((application) => (
              <div
                key={application.id}
                className="border border-white/[0.08] rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{application.full_name}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <p className="text-sm text-gray-400">
                      {application.email} • Reviewed {formatDate(application.reviewed_at!)}
                    </p>
                    {application.admin_notes && (
                      <p className="text-sm text-gray-400 mt-2">
                        <span className="font-semibold">Notes:</span> {application.admin_notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {credentials && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-green-500/30 shadow-2xl max-w-lg w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Account Created Successfully</h3>
              <p className="text-gray-400">Share these credentials with the accountant</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.10]">
                <label className="text-sm font-semibold text-gray-400 mb-2 block">Login URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-white font-mono text-sm bg-gray-800/50 px-3 py-2 rounded-lg">
                    https://worktugal.com
                  </code>
                  <button
                    onClick={() => copyToClipboard('https://worktugal.com', 'url')}
                    className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
                  >
                    {copiedField === 'url' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.10]">
                <label className="text-sm font-semibold text-gray-400 mb-2 block">Email</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-white font-mono text-sm bg-gray-800/50 px-3 py-2 rounded-lg break-all">
                    {credentials.email}
                  </code>
                  <button
                    onClick={() => copyToClipboard(credentials.email, 'email')}
                    className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.10]">
                <label className="text-sm font-semibold text-gray-400 mb-2 block">Password</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-white font-mono text-sm bg-gray-800/50 px-3 py-2 rounded-lg">
                    {credentials.password}
                  </code>
                  <button
                    onClick={() => copyToClipboard(credentials.password, 'password')}
                    className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
                  >
                    {copiedField === 'password' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-300">
                <strong>Note:</strong> Copy these credentials now. They can also log in anytime using this standard password. You can also use these credentials to access their portal for debugging.
              </p>
            </div>

            <Button
              onClick={() => setCredentials(null)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Done
            </Button>
          </motion.div>
        </div>
      )}
          </div>
        </div>
      </div>
    </>
  );
};
