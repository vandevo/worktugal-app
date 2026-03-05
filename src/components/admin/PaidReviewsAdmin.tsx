import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import {
  getReviewsForAdmin,
  updateReviewStatus,
  type PaidComplianceReview
} from '../../lib/paidComplianceReviews';

const STATUS_CONFIG = {
  form_pending: { label: 'Form Pending', color: 'bg-gray-500', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-blue-500', icon: FileText },
  in_review: { label: 'In Review', color: 'bg-yellow-500', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle2 },
  escalated: { label: 'Escalated', color: 'bg-red-500', icon: AlertTriangle }
};

export const PaidReviewsAdmin: React.FC = () => {
  const [reviews, setReviews] = useState<PaidComplianceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviewsForAdmin();
      setReviews(data);
      setError(null);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStatusUpdate = async (
    reviewId: string,
    newStatus: PaidComplianceReview['status']
  ) => {
    setUpdatingStatus(reviewId);
    try {
      await updateReviewStatus(reviewId, newStatus);
      await loadReviews();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredReviews = statusFilter === 'all'
    ? reviews
    : reviews.filter(r => r.status === statusFilter);

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'form_pending').length,
    submitted: reviews.filter(r => r.status === 'submitted').length,
    inReview: reviews.filter(r => r.status === 'in_review').length,
    completed: reviews.filter(r => r.status === 'completed').length,
    escalated: reviews.filter(r => r.status === 'escalated').length
  };

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
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="font-serif text-5xl text-white mb-4 tracking-tight">Paid Compliance Reviews</h1>
            <p className="font-light text-gray-500 text-xl leading-relaxed">Systematic audit of submitted intake protocols.</p>
          </div>
          <Button onClick={loadReviews} variant="secondary" className="px-6 py-2 bg-white/5 border-white/10 text-gray-400 hover:text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Queue
          </Button>
        </div>

        {error && (
          <Alert variant="error" className="mb-8">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {[
            { label: 'Total', value: stats.total, color: 'border-white/5' },
            { label: 'Form Pending', value: stats.pending, color: 'border-gray-500/10' },
            { label: 'Submitted', value: stats.submitted, color: 'border-blue-500/10' },
            { label: 'In Review', value: stats.inReview, color: 'border-yellow-500/10' },
            { label: 'Completed', value: stats.completed, color: 'border-emerald-500/10' },
            { label: 'Escalated', value: stats.escalated, color: 'border-red-500/10' }
          ].map(stat => (
            <div
              key={stat.label}
              className={`bg-[#121212] border ${stat.color} rounded-2xl p-6 transition-all hover:border-white/10`}
            >
              <div className="text-3xl font-serif text-white mb-1">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {['all', 'form_pending', 'submitted', 'in_review', 'completed', 'escalated'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all ${
                  statusFilter === status
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-white'
                }`}
              >
                {status === 'all' ? 'All Reviews' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredReviews.length === 0 ? (
            <div className="p-16 text-center bg-[#121212] rounded-3xl border border-white/5 border-dashed">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-20" />
              <p className="font-light text-gray-500 italic">No reviews detected in this filter sequence.</p>
            </div>
          ) : (
            filteredReviews.map(review => {
              const StatusIcon = STATUS_CONFIG[review.status]?.icon || FileText;
              const isExpanded = expandedReview === review.id;

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden transition-all hover:border-white/10"
                >
                  <div
                    className="p-8 cursor-pointer group"
                    onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                          <StatusIcon className="w-6 h-6 text-blue-400/50" />
                        </div>
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="font-serif text-2xl text-white group-hover:text-blue-400/80 transition-colors">
                              {review.customer_name || review.customer_email}
                            </span>
                            <span className="bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10">
                              {STATUS_CONFIG[review.status]?.label}
                            </span>
                            {review.escalation_flags.length > 0 && (
                              <span className="bg-red-500/5 text-red-400/60 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-red-500/10">
                                {review.escalation_flags.length} Breach Flags
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                            <span className="flex items-center gap-2">
                              <Mail className="w-3 h-3 opacity-50" />
                              {review.customer_email}
                            </span>
                            <span className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 opacity-50" />
                              Logged: {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-600 group-hover:text-white transition-colors ml-8">
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-8 bg-white/[0.01] border-t border-white/5 space-y-12">
                      <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Review Intelligence</h4>
                          <div className="space-y-4 text-sm font-light">
                            <div className="flex justify-between py-2 border-b border-white/5">
                              <span className="text-gray-600 uppercase tracking-widest text-[10px] font-bold">Protocol ID</span>
                              <span className="text-white font-mono">{review.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                              <span className="text-gray-600 uppercase tracking-widest text-[10px] font-bold">Ambiguity Score</span>
                              <span className={`font-bold ${review.ambiguity_score > 3 ? 'text-red-400/60' : 'text-emerald-400/60'}`}>{review.ambiguity_score} Uncertainties</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                              <span className="text-gray-600 uppercase tracking-widest text-[10px] font-bold">System Progress</span>
                              <span className="text-white">{review.form_progress.sections_completed.length}/7 Nodes</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                              <span className="text-gray-600 uppercase tracking-widest text-[10px] font-bold">Initial Log</span>
                              <span className="text-white">{new Date(review.created_at).toLocaleString()}</span>
                            </div>
                            {review.review_delivered_at && (
                              <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-gray-600 uppercase tracking-widest text-[10px] font-bold">Delivery Timestamp</span>
                                <span className="text-white">{new Date(review.review_delivered_at).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Escalation Matrix</h4>
                          {review.escalation_flags.length === 0 ? (
                            <p className="text-gray-500 text-sm font-light italic">No protocol breaches detected.</p>
                          ) : (
                            <div className="space-y-3">
                              {review.escalation_flags.map((flag, i) => (
                                <div
                                  key={i}
                                  className="px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400/60 text-[10px] uppercase tracking-widest font-bold"
                                >
                                  {flag.replace(/_/g, ' ')}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {Object.keys(review.form_data).length > 0 && (
                        <div>
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Data Payload</h4>
                          <div className="bg-black/40 rounded-2xl border border-white/5 p-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                            <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">
                              {JSON.stringify(review.form_data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      <div className="pt-8 border-t border-white/5">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Update Protocol State</h4>
                        <div className="flex flex-wrap gap-4">
                          {['submitted', 'in_review', 'completed', 'escalated'].map(status => (
                            <Button
                              key={status}
                              onClick={() => handleStatusUpdate(review.id, status as PaidComplianceReview['status'])}
                              disabled={review.status === status || updatingStatus === review.id}
                              variant={review.status === status ? 'primary' : 'secondary'}
                              className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold ${
                                review.status === status ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-gray-500'
                              }`}
                            >
                              {updatingStatus === review.id ? 'Syncing...' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
