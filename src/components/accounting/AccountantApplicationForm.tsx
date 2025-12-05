import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Award, Briefcase, Clock, Globe, Upload, CheckCircle, AlertCircle,
  Linkedin, Link as LinkIcon, ArrowRight, ArrowLeft, FileText, X, User, Shield, Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { submitAccountantApplication } from '../../lib/accountantApplications';

const SPECIALIZATIONS_GROUPED = {
  'Getting Started': [
    'Activity opening (Início de atividade) for freelancers',
    'Social Security (NISS) first-year handling',
    'Residency determination (183-day rule)',
  ],
  'Ongoing Compliance': [
    'Simplified regime (Regime Simplificado) management',
    'VAT exemption and threshold monitoring (€15,000 rule)',
    'Quarterly VAT filings',
    'Annual IRS Modelo 3 for freelancers (Categoria B)',
  ],
  'Advanced Services': [
    'Cross-border income classification',
    'NHR/IFICI regime applications',
    'Cryptocurrency income reporting',
  ],
};

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

const STEPS = [
  { id: 1, title: 'Basic Information', color: 'blue', icon: User },
  { id: 2, title: 'Professional Credentials', color: 'green', icon: Shield },
  { id: 3, title: 'Expertise & Services', color: 'cyan', icon: Briefcase },
  { id: 4, title: 'Partnership Fit', color: 'orange', icon: Globe },
  { id: 5, title: 'Final Details', color: 'teal', icon: CheckCircle },
];

const STORAGE_KEY = 'accountant_application_draft';

const DEMO_DATA = {
  fullName: 'Maria Silva',
  email: 'maria.silva@example.com',
  phone: '+351 912 345 678',
  linkedinUrl: 'https://linkedin.com/in/mariasilva',
  websiteUrl: 'https://mariasilva.pt',
  occNumber: '12345',
  hasOCC: true,
  experienceYears: '5-10',
  englishFluency: 'fluent',
  portugueseFluency: 'native',
  specializations: [
    'Activity opening (Início de atividade) for freelancers',
    'Social Security (NISS) first-year handling',
    'Residency determination (183-day rule)',
    'Simplified regime (Regime Simplificado) management',
    'VAT exemption and threshold monitoring (€15,000 rule)',
    'Quarterly VAT filings',
    'Annual IRS Modelo 3 for freelancers (Categoria B)',
  ],
  bio: 'I have been working with freelancers and independent professionals for over 8 years, specializing in helping foreign residents navigate Portuguese taxation. I genuinely enjoy simplifying complex tax rules and making sure my clients feel confident and compliant.',
  availability: '10-20',
  whyWorktugal: 'I currently serve about 30 freelancer clients but I struggle with English-speaking clients who need more hand-holding. I would really value having structured intake support and being part of a specialized network focused on this niche. The revenue-share model sounds fair and the pre-qualified clients would save me a lot of time.',
  resumeFile: null,
  currentFreelancerClients: '30-50',
  foreignClientPercentage: '30-50%',
  preferredCommunication: 'mixed',
  acceptsTriageRole: 'yes',
  vatScenarioAnswer: 'Yes, you have crossed the €15,000 VAT exemption threshold. You need to register for VAT within 15 days and start charging VAT on your invoices going forward. I can help you with the registration and quarterly filings.',
  partnershipInterestLevel: 'very_interested',
  agreeToTerms: false,
};

export const AccountantApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get('demo') === 'true';
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);

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
    currentFreelancerClients: '',
    foreignClientPercentage: '',
    preferredCommunication: '',
    acceptsTriageRole: 'yes',
    vatScenarioAnswer: '',
    partnershipInterestLevel: '',
    agreeToTerms: false,
  });

  useEffect(() => {
    if (isDemoMode) {
      setFormData(DEMO_DATA);
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (isDemoMode) return;
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const draftDate = new Date(parsed.timestamp);
        const daysSinceSave = (Date.now() - draftDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceSave < 7) {
          setShowRestoreBanner(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (isDemoMode) return;
    if (formData.fullName || formData.email) {
      const dataToSave = {
        ...formData,
        resumeFile: null,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, isDemoMode]);

  const restoreDraft = () => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      delete parsed.timestamp;
      setFormData(prev => ({ ...prev, ...parsed }));
      setShowRestoreBanner(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowRestoreBanner(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));

    if (fieldErrors[field]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[field];
      setFieldErrors(newErrors);
    }
  };

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec],
    }));
    setTouchedFields(prev => ({ ...prev, specializations: true }));
  };

  const selectAllSpecializations = () => {
    const allSpecs = Object.values(SPECIALIZATIONS_GROUPED).flat();
    setFormData(prev => ({ ...prev, specializations: allSpecs }));
  };

  const selectBasicSpecializations = () => {
    const basicSpecs = [...SPECIALIZATIONS_GROUPED['Getting Started'], ...SPECIALIZATIONS_GROUPED['Ongoing Compliance']];
    setFormData(prev => ({ ...prev, specializations: basicSpecs }));
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = (step: number): string | null => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = 'Your full name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      if (formData.email && !validateEmail(formData.email)) errors.email = 'Please enter a valid email address';
      if (formData.linkedinUrl && !validateUrl(formData.linkedinUrl)) errors.linkedinUrl = 'Please enter a valid URL';
      if (formData.websiteUrl && !validateUrl(formData.websiteUrl)) errors.websiteUrl = 'Please enter a valid URL';
    }

    if (step === 2) {
      if (!formData.experienceYears) errors.experienceYears = 'Please select your experience level';
    }

    if (step === 3) {
      if (formData.specializations.length === 0) errors.specializations = 'Please select at least one service';
    }

    if (step === 4) {
      if (!formData.currentFreelancerClients) errors.currentFreelancerClients = 'Please select your current client volume';
      if (!formData.foreignClientPercentage) errors.foreignClientPercentage = 'Please select the percentage';
      if (!formData.preferredCommunication) errors.preferredCommunication = 'Please select your preferred method';
      if (!formData.acceptsTriageRole) errors.acceptsTriageRole = 'Please indicate your comfort level';
      if (!formData.vatScenarioAnswer.trim()) errors.vatScenarioAnswer = 'Please share your response to this scenario';
      if (formData.vatScenarioAnswer.length > 0 && formData.vatScenarioAnswer.length < 20) {
        errors.vatScenarioAnswer = 'Please provide a bit more detail (minimum 20 characters)';
      }
      if (!formData.availability) errors.availability = 'Please select your availability';
    }

    if (step === 5) {
      if (!formData.partnershipInterestLevel) errors.partnershipInterestLevel = 'Please indicate your interest level';
      if (!formData.whyWorktugal.trim()) errors.whyWorktugal = 'Please tell us what excites you about this opportunity';
      if (formData.whyWorktugal.length > 0 && formData.whyWorktugal.length < 100) {
        errors.whyWorktugal = 'Please share a bit more (minimum 100 characters)';
      }
      if (!formData.agreeToTerms) errors.agreeToTerms = 'Please confirm to continue';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length > 0 ? Object.values(errors)[0] : null;
  };

  const handleNext = () => {
    setError(null);
    const validationError = validateStep(currentStep);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateStep(5);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (isDemoMode) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/join-accountants/success');
      }, 1000);
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
        current_freelancer_clients: formData.currentFreelancerClients,
        foreign_client_percentage: formData.foreignClientPercentage,
        preferred_communication: formData.preferredCommunication,
        accepts_triage_role: formData.acceptsTriageRole,
        vat_scenario_answer: formData.vatScenarioAnswer,
        partnership_interest_level: formData.partnershipInterestLevel,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      localStorage.removeItem(STORAGE_KEY);
      navigate('/join-accountants/success');
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (currentStep / 5) * 100;

  const getStepColor = (step: number) => {
    const colors = {
      1: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', gradient: 'from-blue-500/10 to-transparent' },
      2: { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400', gradient: 'from-green-500/10 to-transparent' },
      3: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400', gradient: 'from-cyan-500/10 to-transparent' },
      4: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400', gradient: 'from-orange-500/10 to-transparent' },
      5: { bg: 'bg-teal-500/20', border: 'border-teal-500/40', text: 'text-teal-400', gradient: 'from-teal-500/10 to-transparent' },
    };
    return colors[step as keyof typeof colors] || colors[1];
  };

  const renderFileUpload = () => {
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.size <= 5 * 1024 * 1024) {
          handleInputChange('resumeFile', file);
        } else {
          setError('File size must be less than 5MB');
        }
      }
    };

    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-8 transition-all duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
            : 'border-white/20 hover:border-white/40 bg-white/[0.02]'
          }
        `}
      >
        {formData.resumeFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{formData.resumeFile.name}</p>
              <p className="text-xs text-gray-400">
                {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('resumeFile', null)}
              className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center hover:bg-red-500/30 transition-all active:scale-95"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </motion.div>
        ) : (
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Drop your resume here or browse</p>
            <p className="text-sm text-gray-400 mb-4">PDF, DOC, or DOCX • Maximum 5MB</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size <= 5 * 1024 * 1024) {
                    handleInputChange('resumeFile', file);
                  } else {
                    setError('File size must be less than 5MB');
                  }
                }
              }}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-sm text-white cursor-pointer transition-all active:scale-95"
            >
              Browse Files
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6">
              <Award className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <span className="text-sm md:text-base text-blue-400 font-semibold">Founding Partner Opportunity</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
              Join Worktugal's Partner Network
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto px-4">
              Help freelancers and independent professionals navigate Portuguese taxation while growing your practice.
            </p>
          </div>

          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/30">
                <div>
                  <p className="font-semibold text-white">Demo Mode Active</p>
                  <p className="text-sm text-gray-300">
                    All fields are pre-filled so you can quickly test the form flow. Feel free to edit any field.
                  </p>
                </div>
              </Alert>
            </motion.div>
          )}

          <div className="bg-slate-950/95 backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.08] rounded-2xl p-4 md:p-6 shadow-xl shadow-black/20 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">
                Step {currentStep} of 5
              </span>
              <span className="text-sm font-semibold text-white">
                {progressPercentage}% Complete
              </span>
            </div>

            <div className="relative h-2 bg-white/[0.05] rounded-full overflow-hidden mb-4">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center justify-between">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const colors = getStepColor(step.id);

                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <motion.div
                        className={`
                          w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center
                          transition-all duration-200
                          ${isActive ? `${colors.bg} ${colors.border} scale-110` : ''}
                          ${isCompleted ? 'bg-green-500/20 border-green-500/40' : ''}
                          ${!isActive && !isCompleted ? 'bg-white/[0.02] border-white/[0.08]' : ''}
                        `}
                        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                        ) : (
                          <StepIcon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? colors.text : 'text-gray-500'}`} />
                        )}
                      </motion.div>
                      <span className={`hidden md:block text-xs text-center ${isActive ? 'text-white font-semibold' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="flex-1 h-[2px] bg-white/[0.08] mx-1 md:mx-2" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {!isDemoMode && showRestoreBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <Clock className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <p className="font-semibold text-white">Continue where you left off</p>
                  <p className="text-sm text-gray-300">We found a saved draft from earlier.</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={restoreDraft} className="bg-blue-500 hover:bg-blue-600">
                    Resume
                  </Button>
                  <Button size="sm" variant="ghost" onClick={clearDraft}>
                    Start Fresh
                  </Button>
                </div>
              </Alert>
            </motion.div>
          )}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="error">
              {error}
            </Alert>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.form
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === 5) {
                handleSubmit(e);
              } else {
                handleNext();
              }
            }}
            className="bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-white/[0.10] p-6 md:p-12 shadow-xl shadow-black/10"
          >
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className={`bg-gradient-to-br ${getStepColor(1).gradient} rounded-2xl p-6 border border-white/[0.08]`}>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <User className="w-8 h-8 text-blue-400" />
                    Let's start with the basics
                  </h2>
                  <p className="text-gray-300">Tell us a bit about yourself so we can get to know you.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Your full name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Maria Silva"
                        className={`
                          h-12 md:h-14 text-base md:text-lg rounded-2xl
                          transition-all duration-200
                          ${touchedFields.fullName && formData.fullName ? 'pr-12' : ''}
                          ${fieldErrors.fullName ? 'border-red-500/50 focus:border-red-500' : ''}
                        `}
                      />
                      {touchedFields.fullName && formData.fullName && !fieldErrors.fullName && (
                        <CheckCircle className="w-5 h-5 text-green-400 absolute right-4 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {fieldErrors.fullName && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Email address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type="email"
                          inputMode="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="maria@example.com"
                          className={`
                            h-12 md:h-14 text-base rounded-2xl
                            ${touchedFields.email && formData.email ? 'pr-12' : ''}
                            ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500' : ''}
                          `}
                        />
                        {touchedFields.email && formData.email && !fieldErrors.email && validateEmail(formData.email) && (
                          <CheckCircle className="w-5 h-5 text-green-400 absolute right-4 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      {fieldErrors.email && (
                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Phone number
                      </label>
                      <Input
                        type="tel"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+351 912 345 678"
                        className="h-12 md:h-14 text-base rounded-2xl"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optional, but helpful for scheduling calls</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn profile
                    </label>
                    <Input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={`h-12 rounded-2xl ${fieldErrors.linkedinUrl ? 'border-red-500/50' : ''}`}
                    />
                    {fieldErrors.linkedinUrl && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.linkedinUrl}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Helps us understand your professional background</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Website or portfolio
                    </label>
                    <Input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className={`h-12 rounded-2xl ${fieldErrors.websiteUrl ? 'border-red-500/50' : ''}`}
                    />
                    {fieldErrors.websiteUrl && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.websiteUrl}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Optional</p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className={`bg-gradient-to-br ${getStepColor(2).gradient} rounded-2xl p-6 border border-white/[0.08]`}>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-green-400" />
                    Professional credentials
                  </h2>
                  <p className="text-gray-300">Share your qualifications and experience.</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                    <label className="flex items-start gap-4 text-gray-300 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.hasOCC}
                        onChange={(e) => handleInputChange('hasOCC', e.target.checked)}
                        className="mt-1 w-6 h-6 rounded-lg border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 transition-all"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          I am OCC (Ordem dos Contabilistas Certificados) certified
                        </span>
                        <p className="text-sm text-gray-400 mt-1">Required to practice accounting in Portugal</p>
                      </div>
                    </label>

                    <AnimatePresence>
                      {formData.hasOCC && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pl-10"
                        >
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            OCC certification number
                          </label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={formData.occNumber}
                            onChange={(e) => handleInputChange('occNumber', e.target.value)}
                            placeholder="12345"
                            className="h-12 rounded-2xl"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            We'll verify this via the OCC public registry
                          </p>
                        </motion.div>
                      )}

                      {!formData.hasOCC && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4"
                        >
                          <Alert variant="warning">
                            <div>
                              <p className="font-semibold">OCC certification is strongly preferred</p>
                              <p className="text-sm mt-1">
                                We may consider exceptional candidates pursuing certification. Please explain your situation in the final step.
                              </p>
                            </div>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Years of experience with Portuguese taxation <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.experienceYears}
                      onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                      className={`
                        w-full h-12 md:h-14 px-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white text-base
                        border ${fieldErrors.experienceYears ? 'border-red-500/50' : 'border-white/[0.08]'}
                        focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60
                        transition-all duration-200 cursor-pointer
                      `}
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Select your experience level</option>
                      {EXPERIENCE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>{opt.label}</option>
                      ))}
                    </select>
                    {fieldErrors.experienceYears && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.experienceYears}
                      </p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl p-6 border border-blue-500/10">
                    <h4 className="text-blue-300 font-semibold mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Language proficiency
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          English proficiency <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={formData.englishFluency}
                          onChange={(e) => handleInputChange('englishFluency', e.target.value)}
                          className="w-full h-12 px-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all cursor-pointer"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="fluent" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Fluent (C1-C2)</option>
                          <option value="advanced" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Advanced (B2)</option>
                          <option value="intermediate" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Intermediate (B1)</option>
                          <option value="basic" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Basic (A1-A2)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Portuguese proficiency
                        </label>
                        <select
                          value={formData.portugueseFluency}
                          onChange={(e) => handleInputChange('portugueseFluency', e.target.value)}
                          className="w-full h-12 px-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white border border-white/[0.08] focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all cursor-pointer"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="native" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Native</option>
                          <option value="fluent" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Fluent (C1-C2)</option>
                          <option value="advanced" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Advanced (B2)</option>
                          <option value="intermediate" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Intermediate (B1)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Resume / CV <span className="text-red-400">*</span>
                    </label>
                    {renderFileUpload()}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className={`bg-gradient-to-br ${getStepColor(3).gradient} rounded-2xl p-6 border border-white/[0.08]`}>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-cyan-400" />
                    Your expertise
                  </h2>
                  <p className="text-gray-300">What services do you specialize in?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-semibold text-gray-300">
                        Select the services you provide <span className="text-red-400">*</span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={selectBasicSpecializations}
                          className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 transition-all active:scale-95"
                        >
                          Basic
                        </button>
                        <button
                          type="button"
                          onClick={selectAllSpecializations}
                          className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 transition-all active:scale-95"
                        >
                          Select All
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {Object.entries(SPECIALIZATIONS_GROUPED).map(([category, specs]) => (
                        <div key={category}>
                          <h4 className="text-sm font-semibold text-gray-400 mb-3">{category}</h4>
                          <div className="flex flex-wrap gap-2">
                            {specs.map(spec => {
                              const isSelected = formData.specializations.includes(spec);
                              return (
                                <motion.button
                                  key={spec}
                                  type="button"
                                  onClick={() => handleSpecializationToggle(spec)}
                                  className={`
                                    px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                    active:scale-95
                                    ${isSelected
                                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 border-2 border-blue-400'
                                      : 'bg-white/[0.03] text-gray-300 hover:bg-white/[0.06] border-2 border-white/[0.08] hover:border-white/[0.15]'
                                    }
                                  `}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <span className="flex items-center gap-2">
                                    {spec}
                                    {isSelected && <CheckCircle className="w-4 h-4" />}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {fieldErrors.specializations && (
                      <p className="text-red-400 text-xs mt-3 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.specializations}
                      </p>
                    )}

                    <p className="text-sm text-gray-400 mt-4">
                      {formData.specializations.length} {formData.specializations.length === 1 ? 'service' : 'services'} selected
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Tell us your story (optional)
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      placeholder="Share your professional background, what you enjoy about working with freelancers, or anything that makes you unique..."
                      className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all duration-200 resize-none border border-white/[0.08] focus:border-white/[0.15]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className={`bg-gradient-to-br ${getStepColor(4).gradient} rounded-2xl p-6 border border-white/[0.08]`}>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Globe className="w-8 h-8 text-orange-400" />
                    Let's see if we're a match
                  </h2>
                  <p className="text-gray-300">Help us understand your practice and working style.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      How many freelancer clients do you currently serve? <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.currentFreelancerClients}
                      onChange={(e) => handleInputChange('currentFreelancerClients', e.target.value)}
                      className={`
                        w-full h-12 md:h-14 px-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white text-base
                        border ${fieldErrors.currentFreelancerClients ? 'border-red-500/50' : 'border-white/[0.08]'}
                        focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all cursor-pointer
                      `}
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Select range</option>
                      <option value="0-10" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>0-10 clients</option>
                      <option value="10-30" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>10-30 clients</option>
                      <option value="30-50" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>30-50 clients</option>
                      <option value="50+" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>50+ clients</option>
                    </select>
                    {fieldErrors.currentFreelancerClients && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.currentFreelancerClients}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      What percentage are foreign residents or digital nomads? <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.foreignClientPercentage}
                      onChange={(e) => handleInputChange('foreignClientPercentage', e.target.value)}
                      className={`
                        w-full h-12 md:h-14 px-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white text-base
                        border ${fieldErrors.foreignClientPercentage ? 'border-red-500/50' : 'border-white/[0.08]'}
                        focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all cursor-pointer
                      `}
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Select range</option>
                      <option value="0-10%" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>0-10%</option>
                      <option value="10-30%" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>10-30%</option>
                      <option value="30-50%" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>30-50%</option>
                      <option value="50%+" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>50%+</option>
                    </select>
                    {fieldErrors.foreignClientPercentage && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.foreignClientPercentage}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      How do you prefer to communicate with clients? <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.preferredCommunication}
                      onChange={(e) => handleInputChange('preferredCommunication', e.target.value)}
                      className={`
                        w-full h-12 md:h-14 px-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white text-base
                        border ${fieldErrors.preferredCommunication ? 'border-red-500/50' : 'border-white/[0.08]'}
                        focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all cursor-pointer
                      `}
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Select your preferred method</option>
                      <option value="email" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Email only</option>
                      <option value="phone" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Phone calls</option>
                      <option value="whatsapp" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>WhatsApp/messaging apps</option>
                      <option value="portal" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Client portal</option>
                      <option value="mixed" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Mix of all methods</option>
                    </select>
                    {fieldErrors.preferredCommunication && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.preferredCommunication}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Are you comfortable with us handling client intake and diagnostics while you focus on filings? <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.acceptsTriageRole}
                      onChange={(e) => handleInputChange('acceptsTriageRole', e.target.value)}
                      className={`
                        w-full h-12 md:h-14 px-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white text-base
                        border ${fieldErrors.acceptsTriageRole ? 'border-red-500/50' : 'border-white/[0.08]'}
                        focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all cursor-pointer
                      `}
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Please select</option>
                      <option value="yes" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Yes, this model works for me</option>
                      <option value="no" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>No, I prefer full client control</option>
                      <option value="discuss" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>I'd like to discuss this further</option>
                    </select>
                    {fieldErrors.acceptsTriageRole && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.acceptsTriageRole}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Quick scenario: Communication style <span className="text-red-400">*</span>
                    </label>
                    <p className="text-sm text-gray-400 mb-3">
                      A freelancer asks: <span className="italic font-medium text-gray-300">"I just hit €16,000 revenue in 6 months. Do I need to do anything about VAT?"</span>
                    </p>
                    <p className="text-xs text-blue-300 mb-3">
                      How would you respond? (Write as if replying directly to them)
                    </p>
                    <textarea
                      value={formData.vatScenarioAnswer}
                      onChange={(e) => handleInputChange('vatScenarioAnswer', e.target.value)}
                      rows={4}
                      placeholder="Example: 'Yes, you've crossed the VAT threshold. Here's what you need to do...'"
                      className={`
                        w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white placeholder-gray-500
                        focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all duration-200 resize-none
                        border ${fieldErrors.vatScenarioAnswer ? 'border-red-500/50' : 'border-white/[0.08]'}
                      `}
                    />
                    <p className={`text-xs mt-2 ${formData.vatScenarioAnswer.length >= 20 ? 'text-green-400' : 'text-gray-500'}`}>
                      {formData.vatScenarioAnswer.length >= 20
                        ? '✓ Perfect, thanks!'
                        : `${20 - formData.vatScenarioAnswer.length} more characters`}
                    </p>
                    {fieldErrors.vatScenarioAnswer && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.vatScenarioAnswer}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Your weekly availability <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      className={`
                        w-full h-12 md:h-14 px-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white text-base
                        border ${fieldErrors.availability ? 'border-red-500/50' : 'border-white/[0.08]'}
                        focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all cursor-pointer
                      `}
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Select your availability</option>
                      {AVAILABILITY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>{opt.label}</option>
                      ))}
                    </select>
                    {fieldErrors.availability && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.availability}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className={`bg-gradient-to-br ${getStepColor(5).gradient} rounded-2xl p-6 border border-white/[0.08]`}>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-teal-400" />
                    Almost there!
                  </h2>
                  <p className="text-gray-300">Just a couple more things before we wrap up.</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      Partnership model overview
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Here's how the partnership works:
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="text-blue-400 mt-1 text-lg">•</span>
                        <span>Revenue-share on filings (details discussed during call)</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="text-blue-400 mt-1 text-lg">•</span>
                        <span>3-5 client cases per week commitment</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="text-blue-400 mt-1 text-lg">•</span>
                        <span>Worktugal handles intake and triage, you focus on filings</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="text-blue-400 mt-1 text-lg">•</span>
                        <span>English-speaking freelancer clients who are pre-qualified</span>
                      </li>
                    </ul>

                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        How does this sound to you? <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.partnershipInterestLevel}
                        onChange={(e) => handleInputChange('partnershipInterestLevel', e.target.value)}
                        className={`
                          w-full h-12 px-4 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white
                          border ${fieldErrors.partnershipInterestLevel ? 'border-red-500/50' : 'border-white/[0.08]'}
                          focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all cursor-pointer
                        `}
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Please select</option>
                        <option value="very_interested" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Very interested, let's discuss details</option>
                        <option value="interested_with_questions" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Interested but have questions</option>
                        <option value="uncertain" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Uncertain, would need more information</option>
                      </select>
                      {fieldErrors.partnershipInterestLevel && (
                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {fieldErrors.partnershipInterestLevel}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      What excites you about this opportunity? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.whyWorktugal}
                      onChange={(e) => handleInputChange('whyWorktugal', e.target.value)}
                      rows={5}
                      placeholder="Example: 'I serve 30 freelancers but struggle with English-speaking clients. I'd value structured intake support and being part of a specialized network...'"
                      className={`
                        w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-2xl text-white placeholder-gray-500
                        focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-all duration-200 resize-none
                        border ${fieldErrors.whyWorktugal ? 'border-red-500/50' : 'border-white/[0.08]'}
                      `}
                    />
                    <p className={`text-xs mt-2 ${formData.whyWorktugal.length >= 100 ? 'text-green-400' : 'text-gray-500'}`}>
                      {formData.whyWorktugal.length >= 100
                        ? '✓ Perfect, thanks!'
                        : `${100 - formData.whyWorktugal.length} more characters (1-2 sentences)`}
                    </p>
                    {fieldErrors.whyWorktugal && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.whyWorktugal}
                      </p>
                    )}
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                    <label className="flex items-start gap-4 text-gray-300 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className={`
                          mt-1 w-6 h-6 rounded-lg border-gray-600 bg-gray-800/50 text-blue-500
                          focus:ring-blue-500 focus:ring-offset-0 transition-all
                          ${fieldErrors.agreeToTerms ? 'border-red-500' : ''}
                        `}
                      />
                      <span className="text-sm group-hover:text-white transition-colors">
                        I confirm that all information provided is accurate and I'm interested in exploring this partnership opportunity. <span className="text-red-400">*</span>
                      </span>
                    </label>
                    {fieldErrors.agreeToTerms && (
                      <p className="text-red-400 text-xs mt-2 ml-10 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.agreeToTerms}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-white/[0.08] pt-6">
                    <details className="text-xs text-gray-500">
                      <summary className="cursor-pointer hover:text-gray-400 transition-colors mb-2 font-medium">
                        Professional standards & requirements
                      </summary>
                      <div className="mt-4 space-y-2 text-gray-500">
                        <p>By submitting this application, you confirm:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>You hold necessary certifications and licenses to practice accounting in Portugal (or are actively pursuing them)</li>
                          <li>You carry professional liability insurance covering your services</li>
                          <li>You will comply with Portuguese tax law, GDPR, and professional standards</li>
                          <li>You understand Worktugal facilitates client connections but does not employ accountants</li>
                          <li>The information provided in this application is accurate and complete</li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col-reverse md:flex-row gap-4 mt-8 pt-6 border-t border-white/[0.10]">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="ghost"
                  className="flex-1 h-12 md:h-14 text-base rounded-2xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}

              <Button
                type="submit"
                disabled={loading}
                className={`
                  flex-1 h-12 md:h-14 text-base md:text-lg rounded-2xl
                  bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                  shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                  transition-all duration-200 active:scale-[0.98]
                  ${currentStep === 1 ? 'w-full' : ''}
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : currentStep === 5 ? (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {currentStep === 5 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                We review applications within 5 business days and will reach out to qualified candidates.
              </p>
            )}
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
};
