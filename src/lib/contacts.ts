import { supabase } from './supabase';

export interface ContactRequest {
  id?: string;
  created_at?: string;
  purpose: 'accounting' | 'partnership' | 'job' | 'info' | 'other';
  full_name: string;
  email: string;
  company_name?: string;
  website_url?: string;
  message?: string;
  budget_range?: '200-499' | '500-999' | '1000+' | 'not_yet' | 'exploring';
  timeline?: 'this_month' | '3_months' | 'later' | 'flexible';
  status?: 'new' | 'reviewed' | 'replied' | 'converted' | 'archived';
  priority?: 'high' | 'normal' | 'low';
  notes?: string;
  webhook_sent?: boolean;
  webhook_sent_at?: string;
  replied_at?: string;
}

export async function submitContactRequest(data: ContactRequest) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/submit-contact-request`;

  const response = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to submit contact request');
  }

  return result.data;
}

export async function getContactRequests(filters?: {
  status?: string;
  purpose?: string;
  priority?: string;
}) {
  let query = supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.purpose) {
    query = query.eq('purpose', filters.purpose);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

export async function updateContactRequest(
  id: string,
  updates: Partial<ContactRequest>
) {
  const { data, error } = await supabase
    .from('contact_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getContactRequestStats() {
  const { data, error } = await supabase
    .from('contact_requests')
    .select('status, priority, purpose');

  if (error) {
    throw error;
  }

  const stats = {
    total: data.length,
    new: data.filter((r) => r.status === 'new').length,
    highPriority: data.filter((r) => r.priority === 'high').length,
    thisMonth: 0,
    converted: data.filter((r) => r.status === 'converted').length,
  };

  return stats;
}
