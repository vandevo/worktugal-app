import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, FileText, Mail } from 'lucide-react';
import { getConsultBooking } from '../../lib/consults';
import { CONSULT_SERVICES } from '../../types/accounting';

export const ConsultSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getConsultBooking(parseInt(bookingId));
        if (data) {
          setBooking(data);
        }
      } catch (err) {
        console.error('Error loading booking:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const service = booking ? CONSULT_SERVICES.find(s => s.id === booking.service_type) : null;

  return (
    <div className="min-h-screen bg-obsidian py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block"
            >
              <CheckCircle className="w-20 h-20 text-emerald-500/50 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Booking confirmed
            </h1>
            <p className="text-lg text-gray-500 font-light">
              Your consult has been successfully booked and paid.
            </p>
          </div>

          {!loading && booking && service && (
            <div className="space-y-8">
              <div className="bg-white/[0.01] rounded-2xl p-6 border border-white/5">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">Service Details</h3>
                <p className="text-xl font-serif text-white mb-1">{service.name}</p>
                <p className="text-xs text-gray-500 font-light uppercase tracking-widest">{service.duration} · €{service.price}</p>
              </div>

              <div className="bg-white/[0.02] rounded-2xl p-8 border border-white/10 mb-6">
                <div className="text-center mb-8">
                  <Calendar className="w-12 h-12 text-blue-500/50 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif text-white mb-2">Schedule your appointment</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">
                    Choose a time that works for you. Our accountants are available Monday-Friday.
                  </p>
                </div>
                <a
                  href={service.calcomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white text-black hover:bg-gray-200 py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-black/20 text-center"
                >
                  Book your {service.duration} appointment
                </a>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/[0.01] rounded-2xl p-6 text-center border border-white/5">
                  <FileText className="w-6 h-6 text-emerald-500/50 mx-auto mb-3" />
                  <h4 className="text-sm font-serif text-white mb-1">Written Outcome</h4>
                  <p className="text-xs text-gray-500 font-light uppercase tracking-widest leading-relaxed">
                    Delivered within 48 hours
                  </p>
                </div>

                <div className="bg-white/[0.01] rounded-2xl p-6 text-center border border-white/5">
                  <Mail className="w-6 h-6 text-blue-500/50 mx-auto mb-3" />
                  <h4 className="text-sm font-serif text-white mb-1">Check Your Email</h4>
                  <p className="text-xs text-gray-500 font-light uppercase tracking-widest leading-relaxed">
                    Confirmation sent to {booking.email}
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.01] rounded-2xl p-6 border border-white/5">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">What happens next?</h3>
                <ol className="space-y-4">
                  {[
                    "Book your appointment using the button above",
                    "You'll receive calendar invites and reminders",
                    "Meet with your certified accountant via video call",
                    "Receive your written outcome note within 48 hours"
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[10px] font-bold text-blue-500/50 mt-0.5">{i + 1}.</span>
                      <span className="text-xs text-gray-500 font-light uppercase tracking-widest leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="text-center pt-8 border-t border-white/5">
                <Link
                  to="/accounting"
                  className="inline-block bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-colors border border-white/10"
                >
                  Back to Accounting Desk
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
