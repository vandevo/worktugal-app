import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllApplications, updateApplicationStatus, createAccountantProfile } from '../../lib/accountants';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { CheckCircle, XCircle, Clock, Award, Briefcase, Mail, Phone, Calendar } from 'lucide-react';
import type { AccountantApplication } from '../../types/accountant';

export const AccountantApplicationReview: React.FC = () => {
  const [applications, setApplications] = useState<AccountantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const handleApprove = async (application: AccountantApplication) => {
    if (!confirm(`Approve ${application.full_name} as an accountant? They will need to sign up with email ${application.email} to access their accountant dashboard.`)) return;

    setProcessingId(application.id);
    setError(null);

    try {
      await updateApplicationStatus(
        application.id,
        'approved',
        adminNotes[application.id] || 'Application approved. Accountant should sign up with provided email to access dashboard.',
        'admin'
      );

      await loadApplications();
    } catch (err) {
      console.error('Error approving application:', err);
      setError('Failed to approve application');
    } finally {
      setProcessingId(null);
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
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Links</h4>
                        <div className="flex gap-3">
                          {application.resume_url && (
                            <a
                              href={application.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              View Resume ↗
                            </a>
                          )}
                          {application.linkedin_url && (
                            <a
                              href={application.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm"
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
                        onClick={() => handleApprove(application)}
                        disabled={processingId === application.id}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {processingId === application.id ? 'Processing...' : 'Approve'}
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
    </div>
  );
};
