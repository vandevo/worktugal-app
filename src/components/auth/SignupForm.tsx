import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Shield, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { signUp } from '../../lib/auth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Turnstile } from '../ui/Turnstile';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*\d).*$/, 'Password must contain at least one letter and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaState, setCaptchaState] = useState<'loading' | 'ready' | 'verified' | 'error'>('loading');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Development mode bypass
  useEffect(() => {
    if (import.meta.env.DEV) {
      // Auto-bypass CAPTCHA in development
      setCaptchaToken('dev-bypass-token');
      setCaptchaState('verified');
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    if (!captchaToken && !import.meta.env.DEV) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await signUp(data.email, data.password, captchaToken);
      setSuccess('Account created successfully! You can now sign in.');
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      // Reset CAPTCHA on error
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <UserPlus className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-left flex-1">
            <h2 className="text-lg font-bold leading-tight">Create your account</h2>
            <p className="text-sm text-gray-400 leading-tight">Get access to verified perks in Lisbon</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              className="w-full px-4 py-3 pr-12 bg-gray-800/80 border border-gray-600/60 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500/50 focus:bg-gray-750 hover:border-gray-500/60 transition-all duration-200 shadow-sm"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Must include: letters and numbers (minimum 8 characters)
          </p>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 pr-12 bg-gray-800/80 border border-gray-600/60 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500/50 focus:bg-gray-750 hover:border-gray-500/60 transition-all duration-200 shadow-sm"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <motion.div
            className="flex items-center space-x-2"
            animate={{
              color: captchaState === 'verified' ? '#10b981' : captchaState === 'error' ? '#ef4444' : '#d1d5db'
            }}
          >
            <AnimatePresence mode="wait">
              {captchaState === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                >
                  <Loader2 className="h-4 w-4" />
                </motion.div>
              )}
              {captchaState === 'ready' && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Shield className="h-4 w-4" />
                </motion.div>
              )}
              {captchaState === 'verified' && (
                <motion.div
                  key="verified"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <CheckCircle className="h-4 w-4" />
                </motion.div>
              )}
              {captchaState === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Shield className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.label 
              className="block text-sm font-medium"
              animate={{
                fontWeight: captchaState === 'verified' ? 600 : 500
              }}
            >
              {captchaState === 'loading' && (import.meta.env.DEV ? 'Dev Mode - Security Bypassed' : 'Loading Security Check...')}
              {captchaState === 'ready' && 'Security Verification'}
              {captchaState === 'verified' && (import.meta.env.DEV ? 'Dev Mode - Verification Bypassed' : 'Verification Complete')}
              {captchaState === 'error' && 'Verification Failed'}
            </motion.label>
          </motion.div>
          {!import.meta.env.DEV && <Turnstile
            siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || "1x0000000000000000000000000000000AA"}
            onVerify={setCaptchaToken}
            onStateChange={setCaptchaState}
            onError={() => {
              setError('CAPTCHA verification failed. Please try again.');
              setCaptchaToken(null);
            }}
            onExpire={() => {
              setCaptchaToken(null);
            }}
            theme="dark"
            size="normal"
            className="flex justify-center"
          />}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={!captchaToken && !import.meta.env.DEV}
        >
          Create Account
        </Button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-6 text-center pt-4 border-t border-gray-700/50">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all duration-200"
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </motion.div>
  );
};