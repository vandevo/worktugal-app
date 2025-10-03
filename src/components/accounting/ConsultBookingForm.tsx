import { FC } from 'react';
import type { ServiceType } from '../../types/accounting';

interface ConsultBookingFormProps {
  serviceType: ServiceType;
  onSuccess: (bookingId: number) => void;
  onBack: () => void;
}

export const ConsultBookingForm: FC<ConsultBookingFormProps> = ({
  serviceType,
  onSuccess,
  onBack,
}) => {
  const { user } = useAuth();
  const service = CONSULT_SERVICES.find(s => s.id === serviceType);

  const [formData, setFormData] = useState({
    full_name: '',
    email: user?.email || '',
    phone: '',
    preferred_date: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data, error: bookingError } = await createConsultBooking({
        service_type: serviceType,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || undefined,
        preferred_date: formData.preferred_date || undefined,
        notes: formData.notes || undefined,
      });

      if (bookingError) {
        throw bookingError;
      }

      if (data) {
        onSuccess(data.id);
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-6 flex items-center transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="ml-2">Back to services</span>
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{service.name}</h2>
          <p className="text-gray-300 mb-4">{service.description}</p>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">€{service.price}</span>
            <span className="text-gray-400 ml-2">· {service.duration}</span>
          </div>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-semibold text-gray-300 mb-2">
              Full Name *
            </label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+351 xxx xxx xxx"
            />
          </div>

          <div>
            <label htmlFor="preferred_date" className="block text-sm font-semibold text-gray-300 mb-2">
              Preferred Date & Time
            </label>
            <Input
              id="preferred_date"
              name="preferred_date"
              type="datetime-local"
              value={formData.preferred_date}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-400 mt-2">
              We'll confirm availability within 24 hours
            </p>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tell us about your tax situation or any specific questions..."
              className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none"
            />
          </div>

          <div className="bg-white/[0.02] backdrop-blur-xl rounded-xl border border-white/[0.08] p-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              By booking, you agree to our terms of service and privacy policy. Payment will be processed securely via Stripe.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Processing...' : `Continue to Payment (€${service.price})`}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
