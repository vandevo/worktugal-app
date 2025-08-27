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
  const { error } = await supabase.auth.signOut();
  
  // Handle cases where session is already invalid - treat as successful logout
  if (error) {
    const errorMessage = error.message.toLowerCase();
    const errorCode = error.code?.toLowerCase();
    const errorStatus = (error as any).status;
    const isSessionAlreadyInvalid = 
      errorMessage.includes('auth session missing') ||
      errorMessage.includes('session from session_id claim in jwt does not exist') ||
      errorMessage.includes('session_not_found') ||
      errorCode === 'session_not_found' ||
      errorStatus === 403;
    
    if (!isSessionAlreadyInvalid) {
      throw error;
    }
  }
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