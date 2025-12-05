import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Briefcase, Clock, Globe, Upload, CheckCircle, AlertCircle, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { FileUpload } from '../ui/FileUpload';
import { submitAccountantApplication } from '../../lib/accountantApplications';

const SPECIALIZATIONS = [
  'Activity opening (Início de atividade) for freelancers',
  'Simplified regime (Regime Simplificado) management',
  'VAT exemption and threshold monitoring (€15,000 rule)',
  'Quarterly VAT filings',
  'Annual IRS Modelo 3 for freelancers (Categoria B)',
  'Social Security (NISS) first-year handling',
  'Cross-border income classification',
  'NHR/IFICI regime applications',
  'Cryptocurrency income reporting',
  'Residency determination (183-day rule)',
];

const EXPERIENCE_OPTIONS = [
  { value: '1', label: 'Less than 1 year' },
  { value: '1-2', label: '1-2 years' },
  { value: '2-5', label: '2-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
];

const AVAILABILITY_OPTIONS = [
  { value: '5-10', label: '5-10 hours per week' },
  { value: '10-20', label: '10-20 hours per week' },
  { value: '20+', label: '20+ hours (part-time)' },
  { value: 'full-time', label: 'Full-time availability' },
];

export const AccountantApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    websiteUrl: '',
    occNumber: '',
    hasOCC: true,
    experienceYears: '',
    englishFluency: 'fluent',
    portugueseFluency: 'native',
    specializations: [] as string[],
    bio: '',
    availability: '',
    whyWorktugal: '',
    resumeFile: null as File | null,
    // Partnership fit fields
    currentFreelancerClients: '',
    foreignClientPercentage: '',
    preferredCommunication: '',
    acceptsTriageRole: '',
    vatScenarioAnswer: '',
    openToRevenueShare: false,
    canCommitCasesWeekly: false,
    comfortableEnglishClients: false,
    understandsRelationshipModel: false,
    agreeToTerms: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) return 'Full name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.email.includes('@')) return 'Valid email is required';
    if (!formData.experienceYears) return 'Experience level is required';
    if (!formData.availability) return 'Availability is required';
    if (formData.specializations.length === 0) return 'Please select at least one specialization';
    if (!formData.currentFreelancerClients) return 'Please select your current client volume';
    if (!formData.foreignClientPercentage) return 'Please select your foreign client percentage';
    if (!formData.preferredCommunication) return 'Please select your preferred communication method';
    if (!formData.acceptsTriageRole) return 'Please indicate your comfort with the partnership model';
    if (!formData.vatScenarioAnswer.trim()) return 'Please answer the VAT scenario question';
    if (formData.vatScenarioAnswer.length < 20) return 'Please provide a more detailed answer to the VAT scenario (minimum 20 characters)';
    if (!formData.whyWorktugal.trim()) return 'Please tell us why you want to join';
    if (formData.whyWorktugal.length < 200) return 'Please provide more detail in "Why Worktugal?" (minimum 200 characters)';
    if (!formData.agreeToTerms) return 'You must agree to the terms';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const result = await submitAccountantApplication({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        linkedin_url: formData.linkedinUrl || null,
        website_url: formData.websiteUrl || null,
        occ_number: formData.hasOCC ? formData.occNumber : null,
        has_occ: formData.hasOCC,
        experience_years: formData.experienceYears,
        english_fluency: formData.englishFluency,
        portuguese_fluency: formData.portugueseFluency,
        specializations: formData.specializations,
        bio: formData.bio,
        availability: formData.availability,
        why_worktugal: formData.whyWorktugal,
        resume_file: formData.resumeFile,
        // Partnership fit fields
        current_freelancer_clients: formData.currentFreelancerClients,
        foreign_client_percentage: formData.foreignClientPercentage,
        preferred_communication: formData.preferredCommunication,
        accepts_triage_role: formData.acceptsTriageRole,
        vat_scenario_answer: formData.vatScenarioAnswer,
        open_to_revenue_share: formData.openToRevenueShare,
        can_commit_cases_weekly: formData.canCommitCasesWeekly,
        comfortable_english_clients: formData.comfortableEnglishClients,
        understands_relationship_model: formData.understandsRelationshipModel,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      navigate('/join-accountants/success');
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-semibold">Founding Partner Opportunity</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Worktugal's Partner Network
          </h1>

          <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Help freelancers and independent professionals navigate Portuguese taxation while growing your practice.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 max-w-3xl mx-auto mt-8">
            <p className="text-blue-200 font-medium leading-relaxed">
              We're looking for one certified accountant to become our founding partner. You'll receive pre-qualified, English-speaking freelancer clients who've completed our diagnostic intake. Partnership includes revenue-share on filings and advisory services.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/[0.03] border border-white/[0.10] rounded-xl p-6">
              <Briefcase className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Pre-qualified Clients</h3>
              <p className="text-sm text-gray-400">We handle lead generation and qualification</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.10] rounded-xl p-6">
              <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Your Schedule</h3>
              <p className="text-sm text-gray-400">Set your own availability and rates</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.10] rounded-xl p-6">
              <Globe className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Grow Your Practice</h3>
              <p className="text-sm text-gray-400">Focus on clients, we handle the rest</p>
            </div>
          </div>
        </motion.div>

        {error && (
          <Alert variant="error" className="mb-6">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </Alert>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] p-8 md:p-12 space-y-10"
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                1
              </div>
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+351 912 345 678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile
                </label>
                <Input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                <p className="text-xs text-gray-500 mt-1">Helps us understand your professional background</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Website or Portfolio (Optional)
                </label>
                <Input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.10] pt-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold">
                2
              </div>
              Professional Credentials
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 text-gray-300 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.hasOCC}
                    onChange={(e) => handleInputChange('hasOCC', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="font-semibold">I am OCC (Ordem dos Contabilistas Certificados) certified</span>
                </label>

                {formData.hasOCC && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      OCC Certification Number
                    </label>
                    <Input
                      type="text"
                      value={formData.occNumber}
                      onChange={(e) => handleInputChange('occNumber', e.target.value)}
                      placeholder="12345"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      We'll verify this via the OCC public registry before proceeding
                    </p>
                  </div>
                )}

                {!formData.hasOCC && (
                  <Alert variant="warning" className="mt-4">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">OCC certification is preferred</p>
                      <p className="text-sm mt-1">
                        We may consider exceptional candidates pursuing certification. Please explain your situation in the "Why Worktugal?" section below.
                      </p>
                    </div>
                  </Alert>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Years of Experience with Portuguese Taxation <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.experienceYears}
                  onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors"
                  required
                >
                  <option value="">Select experience level</option>
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    English Proficiency <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.englishFluency}
                    onChange={(e) => handleInputChange('englishFluency', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors"
                    required
                  >
                    <option value="fluent">Fluent (C1-C2)</option>
                    <option value="advanced">Advanced (B2)</option>
                    <option value="intermediate">Intermediate (B1)</option>
                    <option value="basic">Basic (A1-A2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Portuguese Proficiency
                  </label>
                  <select
                    value={formData.portugueseFluency}
                    onChange={(e) => handleInputChange('portugueseFluency', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors"
                  >
                    <option value="native">Native</option>
                    <option value="fluent">Fluent (C1-C2)</option>
                    <option value="advanced">Advanced (B2)</option>
                    <option value="intermediate">Intermediate (B1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Resume / CV <span className="text-red-400">*</span>
                </label>
                <FileUpload
                  onFileSelect={(file) => handleInputChange('resumeFile', file)}
                  accept=".pdf,.doc,.docx"
                  maxSize={5}
                  label="Upload your resume"
                />
                <p className="text-xs text-gray-500 mt-2">PDF, DOC, or DOCX • Maximum 5MB</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.10] pt-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                3
              </div>
              Expertise & Services
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Services You Provide <span className="text-red-400">*</span>
                </label>
                <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {SPECIALIZATIONS.map(spec => (
                    <label
                      key={spec}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        formData.specializations.includes(spec)
                          ? 'bg-blue-500/10 border-blue-500/50'
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.specializations.includes(spec)}
                        onChange={() => handleSpecializationToggle(spec)}
                        className="mt-0.5 w-5 h-5 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-gray-300">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  About You & Your Experience
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  placeholder="Tell us about your professional background, areas of expertise, and what makes you a great fit for working with independent professionals..."
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none border border-white/[0.08]"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.10] pt-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                4
              </div>
              Partnership Fit
            </h2>

            <p className="text-gray-400 mb-6">Help us understand your practice and how we can work together effectively.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  How many freelancer/independent professional clients do you currently serve? <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.currentFreelancerClients}
                  onChange={(e) => handleInputChange('currentFreelancerClients', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors"
                  required
                >
                  <option value="">Select range</option>
                  <option value="0-10">0-10 clients</option>
                  <option value="10-30">10-30 clients</option>
                  <option value="30-50">30-50 clients</option>
                  <option value="50+">50+ clients</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  What percentage of your current clients are foreign residents or digital nomads? <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.foreignClientPercentage}
                  onChange={(e) => handleInputChange('foreignClientPercentage', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors"
                  required
                >
                  <option value="">Select range</option>
                  <option value="0-10%">0-10%</option>
                  <option value="10-30%">10-30%</option>
                  <option value="30-50%">30-50%</option>
                  <option value="50%+">50%+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  How do you prefer to communicate with clients during working hours? <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.preferredCommunication}
                  onChange={(e) => handleInputChange('preferredCommunication', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors"
                  required
                >
                  <option value="">Select preferred method</option>
                  <option value="email">Email only</option>
                  <option value="phone">Phone calls</option>
                  <option value="whatsapp">WhatsApp/messaging apps</option>
                  <option value="portal">Client portal</option>
                  <option value="mixed">Mix of all methods</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Are you comfortable with Worktugal handling client intake, diagnostics, and triage, with you focusing on filings and regulated compliance tasks? <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.acceptsTriageRole}
                  onChange={(e) => handleInputChange('acceptsTriageRole', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors"
                  required
                >
                  <option value="">Please select</option>
                  <option value="yes">Yes, this model works for me</option>
                  <option value="no">No, I prefer full client control</option>
                  <option value="discuss">I'd like to discuss this further</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Technical Scenario <span className="text-red-400">*</span>
                </label>
                <p className="text-sm text-gray-400 mb-3">
                  A freelancer client earns €16,000 in their first 6 months of 2025. What happens to their VAT status?
                </p>
                <textarea
                  value={formData.vatScenarioAnswer}
                  onChange={(e) => handleInputChange('vatScenarioAnswer', e.target.value)}
                  rows={3}
                  placeholder="Briefly explain what actions the freelancer must take..."
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none border border-white/[0.08]"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Minimum 20 characters • {formData.vatScenarioAnswer.length} characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Weekly Availability <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors"
                  required
                >
                  <option value="">Select your availability</option>
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.10] pt-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
                5
              </div>
              Why Worktugal?
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Why do you want to join Worktugal's partner network? <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.whyWorktugal}
                onChange={(e) => handleInputChange('whyWorktugal', e.target.value)}
                rows={5}
                placeholder="Share your motivation for joining, what you hope to achieve, and what makes you a great fit for our community of professionals..."
                className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none border border-white/[0.08]"
                required
              />
              <p className="text-xs text-gray-500 mt-2">Minimum 200 characters • {formData.whyWorktugal.length} characters</p>
            </div>
          </div>

          <div className="border-t border-white/[0.10] pt-10">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                Partnership Terms
              </h3>
              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.openToRevenueShare}
                    onChange={(e) => handleInputChange('openToRevenueShare', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm">
                    I'm interested in discussing a revenue-share partnership model where Worktugal handles client intake and I focus on filings
                  </span>
                </label>

                <label className="flex items-start gap-3 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.canCommitCasesWeekly}
                    onChange={(e) => handleInputChange('canCommitCasesWeekly', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm">
                    I can commit to handling 3-5 client cases per week if matched with Worktugal
                  </span>
                </label>

                <label className="flex items-start gap-3 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.comfortableEnglishClients}
                    onChange={(e) => handleInputChange('comfortableEnglishClients', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm">
                    I am comfortable working with English-speaking clients
                  </span>
                </label>

                <label className="flex items-start gap-3 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.understandsRelationshipModel}
                    onChange={(e) => handleInputChange('understandsRelationshipModel', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm">
                    I acknowledge Worktugal owns intake and client triage and I will focus on filings and regulated tasks
                  </span>
                </label>
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <h4 className="font-semibold text-white mb-3">Professional Standards</h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>By submitting this application, you confirm:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                    <li>You hold necessary certifications and licenses to practice accounting in Portugal (or are actively pursuing them)</li>
                    <li>You carry professional liability insurance covering your services</li>
                    <li>You will comply with Portuguese tax law, GDPR, and professional standards</li>
                    <li>You understand Worktugal facilitates client connections but does not employ accountants - you operate as an independent professional</li>
                    <li>The information provided in this application is accurate and complete</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4">
                    Note: False information may result in application rejection or termination of partnership.
                  </p>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 text-gray-300 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                required
              />
              <span className="text-sm">
                I have read and agree to the above professional standards and confirm that all information provided is accurate. <span className="text-red-400">*</span>
              </span>
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-lg py-4"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Submit Application
                </>
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              We review applications within 5 business days. Qualified candidates will be invited for a brief video interview.
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
};
