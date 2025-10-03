import React, { useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { insertLead } from '../../lib/leads';

export const EarlyAccessForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    main_need: '',
    urgency: '',
    consent: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    if (!formData.consent) {
      setError('Please agree to receive updates to continue');
      return;
    }

    setIsSubmitting(true);

    try {
      await insertLead({
        name: formData.name,
        email: formData.email,
        country: formData.country || null,
        main_need: formData.main_need || null,
        urgency: formData.urgency || null,
        source: 'accounting_early_access',
        consent_marketing: formData.consent,
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting lead:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-900 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-12">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">You're on the list!</h2>
            <div className="max-w-lg mx-auto space-y-4">
              <p className="text-lg text-gray-300">
                We'll send you booking links as soon as slots open.
              </p>
              <p className="text-gray-400">
                If your case is urgent, reply to the confirmation email with your main question and NIF status.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Join Early Access</h2>
          <p className="text-xl text-gray-300">
            Be the first to get access when we open booking slots. No commitment required.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Country
                </label>
                <Input
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="e.g., Portugal, USA"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  How urgent is this?
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150"
                >
                  <option value="">Select urgency</option>
                  <option value="This week">This week</option>
                  <option value="This month">This month</option>
                  <option value="Just exploring">Just exploring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                What do you need help with?
              </label>
              <textarea
                value={formData.main_need}
                onChange={(e) => handleInputChange('main_need', e.target.value)}
                rows={3}
                placeholder="e.g., Setting up as a freelancer, filing annual return, NIF questions..."
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none"
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <input
                type="checkbox"
                id="consent"
                checked={formData.consent}
                onChange={(e) => handleInputChange('consent', e.target.checked)}
                disabled={isSubmitting}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="consent" className="text-sm text-gray-300">
                I agree to receive updates about Worktugal Accounting Desk Early Access. You can unsubscribe anytime. *
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.consent}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Join the Waitlist'
              )}
            </Button>

            <p className="text-sm text-gray-400 text-center">
              We respect your privacy. Your information is secure and will only be used to notify you when booking opens.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
