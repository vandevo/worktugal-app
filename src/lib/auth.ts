import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export const signUp = async (email: string, password: string, captchaToken?: string) => {
  const options: any = {
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin, // Set proper redirect
      data: {
        email_confirm: false, // Explicitly disable email confirmation
      },
    },
  };

  // Add captcha token if provided
  if (captchaToken) {
    options.options.captchaToken = captchaToken;
  }

  const { data, error } = await supabase.auth.signUp({
    ...options,
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string, captchaToken?: string) => {
  const options: any = {
    email,
    password,
  };

  // Add captcha token if provided
  if (captchaToken) {
    options.options = { captchaToken };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    ...options,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error: any) {
    // For any error during logout (including 403, session_not_found, etc.),
    // treat it as successful since the goal is to clear the user's session
    console.warn('Sign out error (treating as successful):', error.message || error);
  }
  
  // Always return successfully - if there was an error, the session is likely
  // already invalid anyway, which achieves the same result as a successful logout
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

export const resetPasswordForEmail = async (email: string, captchaToken?: string) => {
  const options: any = {
    redirectTo: `${window.location.origin}/reset-password`,
  };

  // Add captcha token if provided
  if (captchaToken) {
    options.captchaToken = captchaToken;
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, options);
  if (error) throw error;
  return data;
};