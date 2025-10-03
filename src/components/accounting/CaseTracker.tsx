import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUserConsultBookings } from '../../lib/consults';
import { CONSULT_SERVICES } from '../../types/accounting';
import { Clock, CheckCircle, Calendar, FileText, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';

type ConsultBooking = {
  id: number;
  service_type: string;
  status: string;
  full_name: string;
  email: string;
  phone?: string;
  preferred_date?: string;
  scheduled_date?: string;
  outcome_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

const STATUS_CONFIG = {
  pending_payment: {
    label: 'Requested',
    color: 'gray',
    icon: Clock,
    description: 'Awaiting payment'
  },
  completed_payment: {
    label: 'Paid',
    color: 'blue',
    icon: CheckCircle,
    description: 'Payment received, awaiting scheduling'
  },
  approved: {
    label: 'Scheduled',
    color: 'purple',
    icon: Calendar,
    description: 'Consultation scheduled'
  },
  rejected: {
    label: 'Delivered',
    color: 'green',
    icon: FileText,
    description: 'Outcome note delivered'
  }
} as const;

export const CaseTracker: React.FC = () => {
  const [bookings, setBookings] = useState<ConsultBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getUserConsultBookings();

      if (fetchError) {
        throw fetchError;
      }

      setBookings(data || []);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getService = (serviceType: string) => {
    return CONSULT_SERVICES.find(s => s.id === serviceType);
  };

  const getStatusInfo = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      label: status,
      color: 'gray',
      icon: AlertCircle,
      description: 'Unknown status'
    };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        {error}
      </Alert>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Consultations Yet</h3>
        <p className="text-gray-400 mb-6">
          You haven't booked any consultations yet.
        </p>
        <Button onClick={() => window.location.href = '/accounting'}>
          Book Your First Consultation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Consultations</h2>
        <button
          onClick={loadBookings}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => {
          const service = getService(booking.service_type);
          const statusInfo = getStatusInfo(booking.status);
          const StatusIcon = statusInfo.icon;

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6 hover:border-white/[0.20] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {service?.name || booking.service_type}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusInfo.color === 'green' ? 'bg-green-400/10 text-green-400' :
                      statusInfo.color === 'blue' ? 'bg-blue-400/10 text-blue-400' :
                      statusInfo.color === 'purple' ? 'bg-purple-400/10 text-purple-400' :
                      'bg-gray-400/10 text-gray-400'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </div>
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{statusInfo.description}</p>
                </div>
                {service && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">€{service.price}</p>
                    <p className="text-xs text-gray-400">{service.duration}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Booked On</p>
                  <p className="text-sm text-gray-300">{formatDate(booking.created_at)}</p>
                </div>

                {booking.preferred_date && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Preferred Date</p>
                    <p className="text-sm text-gray-300">{formatDate(booking.preferred_date)}</p>
                  </div>
                )}

                {booking.scheduled_date && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Scheduled For</p>
                    <p className="text-sm font-semibold text-blue-400">{formatDate(booking.scheduled_date)}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-1">Case ID</p>
                  <p className="text-sm font-mono text-gray-400">#{booking.id}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Your Notes</p>
                  <p className="text-sm text-gray-300 bg-white/[0.02] rounded-lg p-3">
                    {booking.notes}
                  </p>
                </div>
              )}

              {booking.outcome_url && (
                <div className="border-t border-white/[0.10] pt-4">
                  <a
                    href={booking.outcome_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    View Outcome Document
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {booking.status === 'pending_payment' && (
                <div className="border-t border-white/[0.10] pt-4">
                  <Button
                    onClick={() => window.location.href = `/accounting/checkout?booking=${booking.id}`}
                    size="sm"
                  >
                    Complete Payment
                  </Button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
