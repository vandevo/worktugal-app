import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllApplications, updateApplicationStatus, approveApplicationAndCreateAccount } from '../../lib/accountants';
import { getSignedUrl } from '../../lib/storage';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { CheckCircle, XCircle, Clock, Award, Briefcase, Mail, Phone, Calendar, FileText, Copy, Check, ArrowLeft } from 'lucide-react';
import type { AccountantApplication } from '../../types/accountant';

export const AccountantApplicationReview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      const { data, error } = await getAllApplications();

      if (error) throw error;
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
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian py-24 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="mb-8 px-6 py-2 bg-white/5 border-white/10 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <h1 className="font-serif text-5xl text-white mb-4 tracking-tight">Accountant Applications</h1>
          <p className="font-light text-gray-500 text-xl leading-relaxed">Review and authorize professional partners for the ecosystem.</p>
        </div>

        <div className="space-y-12">
          {error && (
            <Alert variant="error" className="mb-8">
              {error}
            </Alert>
          )}

          <section>
            <h2 className="font-serif text-2xl text-white mb-8 flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-400/50" />
              Pending Applications
              <span className="ml-2 text-sm font-sans font-light text-gray-500">({pendingApplications.length})</span>
            </h2>

            {pendingApplications.length === 0 ? (
              <div className="p-16 text-center bg-[#121212] rounded-3xl border border-white/5 border-dashed">
                <CheckCircle className="w-12 h-12 text-emerald-400/20 mx-auto mb-4" />
                <p className="font-light text-gray-500 italic text-lg">All applications have been processed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendingApplications.map((application) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden transition-all hover:border-white/10"
                  >
                    <div
                      className="p-8 cursor-pointer group"
                      onClick={() => setExpandedId(expandedId === application.id ? null : application.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h3 className="font-serif text-2xl text-white group-hover:text-blue-400/80 transition-colors">{application.full_name}</h3>
                            {getStatusBadge(application.status)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 opacity-50" />
                              <span className="font-sans font-light lowercase text-xs">{application.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 opacity-50" />
                              <span className="font-sans font-light text-xs">{application.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-3 h-3 opacity-50" />
                              <span>{application.experience_years} Years Experience</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 opacity-50" />
                              <span>Applied {formatDate(application.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-600 group-hover:text-white transition-colors ml-8">
                          {expandedId === application.id ? 'Collapse' : 'Expand'}
                        </div>
                      </div>
                    </div>

                    {expandedId === application.id && (
                      <div className="p-8 bg-white/[0.01] border-t border-white/5 space-y-12">
                        <div>
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 flex items-center gap-2">
                            <Award className="w-4 h-4 text-blue-400/50" />
                            Verified Specializations
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {application.specializations.map((spec, idx) => (
                              <span
                                key={idx}
                                className="bg-white/5 text-gray-400 px-4 py-2 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {application.has_occ && (
                          <div>
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4">Official OCC Certification</h4>
                            <div className="flex items-center gap-3">
                              <span className="bg-blue-500/5 text-blue-400/60 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-blue-500/10">OCC Verified</span>
                              <code className="text-white font-mono text-sm">#{application.occ_number || 'N/A'}</code>
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4">Professional Bio</h4>
                          <p className="font-light text-gray-400 text-sm leading-relaxed max-w-3xl italic">"{application.bio}"</p>
                        </div>

                        {/* Partnership Fit Section */}
                        <div className="pt-8 border-t border-white/5">
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-8 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-400/50" />
                            Ecosystem Compatibility
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            {(application as any).current_freelancer_clients && (
                              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                <span className="text-[10px] uppercase tracking-widest text-gray-600 block mb-2 font-bold">Current Freelancer Pool</span>
                                <p className="text-white font-serif text-lg">{(application as any).current_freelancer_clients}</p>
                              </div>
                            )}
                            {(application as any).foreign_client_percentage && (
                              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                <span className="text-[10px] uppercase tracking-widest text-gray-600 block mb-2 font-bold">Foreign Portfolio %</span>
                                <p className="text-white font-serif text-lg">{(application as any).foreign_client_percentage}</p>
                              </div>
                            )}
                            {(application as any).preferred_communication && (
                              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                <span className="text-[10px] uppercase tracking-widest text-gray-600 block mb-2 font-bold">Preferred Channel</span>
                                <p className="text-white font-serif text-lg capitalize">{(application as any).preferred_communication}</p>
                              </div>
                            )}
                            {(application as any).accepts_triage_role && (
                              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                <span className="text-[10px] uppercase tracking-widest text-gray-600 block mb-2 font-bold">Triage Role Acceptance</span>
                                <p className={`font-serif text-lg ${(application as any).accepts_triage_role === 'yes' ? 'text-emerald-400/60' : (application as any).accepts_triage_role === 'no' ? 'text-red-400/60' : 'text-yellow-400/60'}`}>
                                  {(application as any).accepts_triage_role === 'yes' ? '✓ Authorized' : (application as any).accepts_triage_role === 'no' ? '✗ Declined' : '? Negotiable'}
                                </p>
                              </div>
                            )}
                          </div>

                          {(application as any).vat_scenario_answer && (
                            <div className="mt-8">
                              <details className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden group">
                                <summary className="cursor-pointer p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-white transition-colors bg-white/5">
                                  VAT Scenario Diagnostic Output
                                </summary>
                                <div className="p-8 space-y-6">
                                  <p className="text-xs text-gray-500 italic">Context: A freelancer earns €16,000 in their first 6 months of 2025. What happens to their VAT status?</p>
                                  <p className="text-sm text-gray-300 font-light leading-relaxed">{(application as any).vat_scenario_answer}</p>
                                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                    <p className="text-[10px] uppercase tracking-widest text-blue-400/60 font-bold">Protocol Alignment Check</p>
                                    <p className="text-xs text-blue-300/60 mt-2">Required Action: VAT registration by the end of the month in which the €15,000 threshold is breached.</p>
                                  </div>
                                </div>
                              </details>
                            </div>
                          )}

                          {/* Partnership Terms Checkboxes */}
                          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                              (application as any).open_to_revenue_share ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400/60' : 'bg-white/5 border-white/5 text-gray-600'
                            }`}>
                              {(application as any).open_to_revenue_share ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              <span className="text-[10px] uppercase tracking-widest font-bold">Revenue Share</span>
                            </div>
                            <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                              (application as any).can_commit_cases_weekly ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400/60' : 'bg-white/5 border-white/5 text-gray-600'
                            }`}>
                              {(application as any).can_commit_cases_weekly ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              <span className="text-[10px] uppercase tracking-widest font-bold">Capacity</span>
                            </div>
                            <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                              (application as any).comfortable_english_clients ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400/60' : 'bg-white/5 border-white/5 text-gray-600'
                            }`}>
                              {(application as any).comfortable_english_clients ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              <span className="text-[10px] uppercase tracking-widest font-bold">English Fluency</span>
                            </div>
                            <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                              (application as any).understands_relationship_model ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400/60' : 'bg-white/5 border-white/5 text-gray-600'
                            }`}>
                              {(application as any).understands_relationship_model ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              <span className="text-[10px] uppercase tracking-widest font-bold">Protocol Sync</span>
                            </div>
                          </div>
                        </div>

                        {(application.resume_url || application.linkedin_url) && (
                          <div className="pt-8 border-t border-white/5">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Credential Dossier</h4>
                            <div className="flex gap-4">
                              {application.resume_url && (
                                <Button
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
                                      setError('Failed to load resume dossier.');
                                    }
                                  }}
                                  className="flex items-center gap-3"
                                >
                                  <FileText className="w-4 h-4" />
                                  Review Resume
                                </Button>
                              )}
                              {application.linkedin_url && (
                                <a
                                  href={application.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all"
                                >
                                  LinkedIn Dossier ↗
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="pt-8 border-t border-white/5">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                            Internal Administrative Notes
                          </label>
                          <textarea
                            value={adminNotes[application.id] || ''}
                            onChange={(e) => setAdminNotes(prev => ({
                              ...prev,
                              [application.id]: e.target.value
                            }))}
                            rows={4}
                            placeholder="Add strategic evaluation notes..."
                            className="w-full px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:bg-white/[0.04] transition-all resize-none font-light text-sm"
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            onClick={() => handleApproveAndCreateAccount(application)}
                            disabled={processingId === application.id}
                            className="flex-1 bg-white text-black hover:bg-gray-200"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {processingId === application.id ? 'Processing...' : 'Authorize Partner & Initialize Account'}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleReject(application.id)}
                            disabled={processingId === application.id}
                            className="px-8 text-red-400/60 hover:text-red-400"
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
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-8">
              Review Archive ({reviewedApplications.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {reviewedApplications.map((application) => (
                <Card
                  key={application.id}
                  className="bg-[#121212] border-white/5 p-6 opacity-60 hover:opacity-100 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-serif text-xl text-white">{application.full_name}</h3>
                        {getStatusBadge(application.status)}
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                        {application.email} • Archive Verified {formatDate(application.reviewed_at!)}
                      </p>
                      {application.admin_notes && (
                        <p className="mt-4 text-sm text-gray-500 font-light italic border-l-2 border-white/5 pl-4 leading-relaxed">
                          "{application.admin_notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {credentials && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-obsidian to-surface-dark rounded-2xl border border-green-500/30 shadow-2xl max-w-lg w-full p-8"
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
                  <code className="flex-1 text-white font-mono text-sm bg-surface-dark/50 px-3 py-2 rounded-lg">
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
                  <code className="flex-1 text-white font-mono text-sm bg-surface-dark/50 px-3 py-2 rounded-lg break-all">
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
                  <code className="flex-1 text-white font-mono text-sm bg-surface-dark/50 px-3 py-2 rounded-lg">
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
  );
};
