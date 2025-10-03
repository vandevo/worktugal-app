import { supabase } from './supabase';

export interface LeadSubmission {
  name: string;
  email: string;
  country?: string;
  main_need?: string;
  urgency?: string;
  consent: boolean;
  source?: string;
}

export interface Lead extends LeadSubmission {
  id: number;
  created_at: string;
  status: string;
}

/**
 * Insert a new lead into the leads_accounting table
 * No authentication required - anonymous submissions allowed
 * Automatically triggers Make.com webhook for email automation
 */
export async function insertLead(data: LeadSubmission): Promise<{ data: Lead | null; error: Error | null }> {
  try {
    // Call Edge Function to submit lead
    // Edge Function has proper database access and will trigger Make.com webhook
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const functionUrl = `${supabaseUrl}/functions/v1/submit-lead`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        country: data.country || '',
        main_need: data.main_need || '',
        urgency: data.urgency || '',
        consent: data.consent,
        source: data.source || 'accounting_early_access',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to submit lead:', errorData);
      return {
        data: null,
        error: new Error(errorData.error || 'Failed to submit lead'),
      };
    }

    const result = await response.json();

    if (!result.success) {
      return {
        data: null,
        error: new Error(result.error || 'Failed to submit lead'),
      };
    }

    return { data: result.data as Lead, error: null };
  } catch (error) {
    console.error('Unexpected error submitting lead:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Get a lead by ID (service role only)
 */
export async function getLead(id: number): Promise<{ data: Lead | null; error: Error | null }> {
  try {
    const { data: lead, error } = await supabase
      .from('leads_accounting')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching lead:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: lead as Lead, error: null };
  } catch (error) {
    console.error('Unexpected error fetching lead:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Get leads by email (for authenticated users to see their own submissions)
 */
export async function getLeadsByEmail(email: string): Promise<{ data: Lead[] | null; error: Error | null }> {
  try {
    const { data: leads, error } = await supabase
      .from('leads_accounting')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads by email:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: leads as Lead[], error: null };
  } catch (error) {
    console.error('Unexpected error fetching leads by email:', error);
    return { data: null, error: error as Error };
  }
}
