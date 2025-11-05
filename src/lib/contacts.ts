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
  // Use RPC function to bypass RLS for admin users
  const { data, error } = await supabase.rpc('get_all_contact_requests');

  if (error) {
    throw error;
  }

  // Apply filters client-side
  let filteredData = data || [];

  if (filters?.status) {
    filteredData = filteredData.filter((r: any) => r.status === filters.status);
  }
  if (filters?.purpose) {
    filteredData = filteredData.filter((r: any) => r.purpose === filters.purpose);
  }
  if (filters?.priority) {
    filteredData = filteredData.filter((r: any) => r.priority === filters.priority);
  }

  return filteredData;
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
  const { data, error } = await supabase.rpc('get_all_contact_requests');

  if (error) {
    throw error;
  }

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    total: data.length,
    new: data.filter((r) => r.status === 'new').length,
    highPriority: data.filter((r) => r.priority === 'high').length,
    thisMonth: data.filter((r) => new Date(r.created_at || '') >= firstDayOfMonth).length,
    converted: data.filter((r) => r.status === 'converted').length,
    byPurpose: {
      accounting: data.filter((r) => r.purpose === 'accounting').length,
      partnership: data.filter((r) => r.purpose === 'partnership').length,
      job: data.filter((r) => r.purpose === 'job').length,
      other: data.filter((r) => r.purpose === 'info' || r.purpose === 'other').length,
    },
  };

  return stats;
}

export async function getRecentContactRequests(limit: number = 5) {
  const { data, error } = await supabase.rpc('get_all_contact_requests');

  if (error) {
    throw error;
  }

  // Return only the most recent entries up to the limit
  return (data || []).slice(0, limit);
}
