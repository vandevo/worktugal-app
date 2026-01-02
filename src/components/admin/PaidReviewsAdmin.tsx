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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Paid Compliance Reviews</h1>
            <p className="text-gray-400 mt-1">Manage and review submitted intake forms</p>
          </div>
          <Button onClick={loadReviews} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-700' },
            { label: 'Form Pending', value: stats.pending, color: 'bg-gray-600' },
            { label: 'Submitted', value: stats.submitted, color: 'bg-blue-600' },
            { label: 'In Review', value: stats.inReview, color: 'bg-yellow-600' },
            { label: 'Completed', value: stats.completed, color: 'bg-green-600' },
            { label: 'Escalated', value: stats.escalated, color: 'bg-red-600' }
          ].map(stat => (
            <div
              key={stat.label}
              className={`${stat.color} rounded-xl p-4 text-center`}
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'form_pending', 'submitted', 'in_review', 'completed', 'escalated'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {status === 'all' ? 'All' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-12 text-center">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No reviews found</p>
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
                  className="bg-white/[0.03] rounded-xl border border-white/[0.08] overflow-hidden"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${STATUS_CONFIG[review.status]?.color} flex items-center justify-center`}>
                          <StatusIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium">
                              {review.customer_name || review.customer_email}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${STATUS_CONFIG[review.status]?.color} text-white`}>
                              {STATUS_CONFIG[review.status]?.label}
                            </span>
                            {review.escalation_flags.length > 0 && (
                              <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-300 border border-red-500/30">
                                {review.escalation_flags.length} flags
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {review.customer_email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-white/[0.05] pt-6">
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-semibold mb-3">Review Info</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">ID</span>
                              <span className="text-white font-mono">{review.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Ambiguity Score</span>
                              <span className="text-white">{review.ambiguity_score} "Not sure" answers</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Sections Completed</span>
                              <span className="text-white">{review.form_progress.sections_completed.length}/7</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Created</span>
                              <span className="text-white">{new Date(review.created_at).toLocaleString()}</span>
                            </div>
                            {review.review_delivered_at && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Delivered</span>
                                <span className="text-white">{new Date(review.review_delivered_at).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-3">Escalation Flags</h4>
                          {review.escalation_flags.length === 0 ? (
                            <p className="text-gray-400 text-sm">No escalation flags</p>
                          ) : (
                            <div className="space-y-2">
                              {review.escalation_flags.map((flag, i) => (
                                <div
                                  key={i}
                                  className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm"
                                >
                                  {flag.replace(/_/g, ' ')}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {Object.keys(review.form_data).length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-white font-semibold mb-3">Form Responses</h4>
                          <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                              {JSON.stringify(review.form_data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex flex-wrap gap-3">
                        <h4 className="text-white font-semibold w-full mb-1">Update Status</h4>
                        {['submitted', 'in_review', 'completed', 'escalated'].map(status => (
                          <Button
                            key={status}
                            onClick={() => handleStatusUpdate(review.id, status as PaidComplianceReview['status'])}
                            disabled={review.status === status || updatingStatus === review.id}
                            variant={review.status === status ? 'primary' : 'outline'}
                            size="sm"
                          >
                            {updatingStatus === review.id ? 'Updating...' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label}
                          </Button>
                        ))}
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
