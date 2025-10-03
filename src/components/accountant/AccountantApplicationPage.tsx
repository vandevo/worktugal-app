import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';
import { DocumentUpload } from '../ui/DocumentUpload';
import { CheckCircle, Briefcase, Award, Globe } from 'lucide-react';
import { submitAccountantApplication } from '../../lib/accountants';
import type { Certification } from '../../types/accountant';

export const AccountantApplicationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    experience_years: 0,
    specializations: [] as string[],
    certifications: [] as Certification[],
    resume_url: '',
    resume_path: '',
    linkedin_url: '',
  });

  const [currentCert, setCurrentCert] = useState({ name: '', number: '', expiry: '' });

  const SPECIALIZATIONS = [
    'Freelancer Tax',
    'NHR (Non-Habitual Resident)',
    'Annual Tax Returns',
    'VAT Registration',
    'Activity Opening',
    'Cryptocurrency Tax',
    'Rental Income',
    'Investment Income',
    'Social Security',
    'D7/D2 Visa Tax Guidance',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const addCertification = () => {
    if (currentCert.name && currentCert.number) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, { ...currentCert }],
      }));
      setCurrentCert({ name: '', number: '', expiry: '' });
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await submitAccountantApplication(formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] p-12 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Application Submitted!</h1>
            <p className="text-gray-300 text-lg mb-8">
              Thank you for your interest in joining our team. We'll review your application and get back to you within 3-5 business days.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Return to Homepage
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-8 h-8 text-blue-400" />
        <div>
          <h3 className="text-xl font-semibold text-white">Basic Information</h3>
          <p className="text-gray-400 text-sm">Tell us about yourself</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Full Name *
          </label>
          <Input
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Your full legal name"
            required
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
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Phone Number *
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+351 912 345 678"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Years of Experience *
          </label>
          <Input
            type="number"
            value={formData.experience_years}
            onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
            placeholder="5"
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          LinkedIn Profile
        </label>
        <Input
          type="url"
          value={formData.linkedin_url}
          onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>

      <div>
        <DocumentUpload
          label="Resume / CV *"
          hint="Upload your resume or CV (PDF, DOC, DOCX, or image)"
          value={formData.resume_url}
          onChange={(url, path) => {
            handleInputChange('resume_url', url);
            handleInputChange('resume_path', path);
          }}
          onClear={() => {
            handleInputChange('resume_url', '');
            handleInputChange('resume_path', '');
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Why do you want to join? *
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          placeholder="Tell us about your experience and why you'd be a great fit for our team..."
          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-8 h-8 text-purple-400" />
        <div>
          <h3 className="text-xl font-semibold text-white">Expertise & Certifications</h3>
          <p className="text-gray-400 text-sm">Your specializations and credentials</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Areas of Specialization (select all that apply) *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {SPECIALIZATIONS.map(spec => (
            <button
              key={spec}
              type="button"
              onClick={() => toggleSpecialization(spec)}
              className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                formData.specializations.includes(spec)
                  ? 'border-purple-400 bg-purple-400/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
              }`}
            >
              <span className="text-sm">{spec}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Professional Certifications
        </label>

        {formData.certifications.length > 0 && (
          <div className="space-y-2 mb-4">
            {formData.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/[0.02] border border-white/[0.08] rounded-lg p-3"
              >
                <div>
                  <p className="text-white font-medium">{cert.name}</p>
                  <p className="text-sm text-gray-400">
                    #{cert.number} {cert.expiry && `• Expires: ${cert.expiry}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <Input
            value={currentCert.name}
            onChange={(e) => setCurrentCert(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Certification name (e.g., OCC)"
          />
          <Input
            value={currentCert.number}
            onChange={(e) => setCurrentCert(prev => ({ ...prev, number: e.target.value }))}
            placeholder="Certificate number"
          />
          <Input
            type="date"
            value={currentCert.expiry}
            onChange={(e) => setCurrentCert(prev => ({ ...prev, expiry: e.target.value }))}
            placeholder="Expiry date"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addCertification}
          disabled={!currentCert.name || !currentCert.number}
        >
          Add Certification
        </Button>
      </div>
    </div>
  );

  const isStep1Valid = () => {
    return formData.full_name && formData.email && formData.phone && formData.bio && formData.experience_years > 0 && formData.resume_url;
  };

  const isStep2Valid = () => {
    return formData.specializations.length > 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Join Our Accountant Team</h1>
          <p className="text-xl text-gray-300">
            Help expats navigate Portuguese tax with expert consultation services
          </p>
        </motion.div>

        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Step {step} of 2</span>
            </div>
            <div className="flex gap-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    i <= step ? 'bg-purple-400' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}

              <div className="flex-1" />

              {step < 2 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!isStep1Valid()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStep2Valid() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
