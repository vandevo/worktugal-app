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
    const { data: lead, error } = await supabase
      .from('leads_accounting')
      .insert({
        name: data.name,
        email: data.email,
        country: data.country || null,
        main_need: data.main_need || null,
        urgency: data.urgency || null,
        consent: data.consent,
        source: data.source || 'accounting_page',
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting lead:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Call Make.com webhook directly to trigger email automation
    // This runs in the background and doesn't block the user experience
    try {
      const makeWebhookUrl = 'https://hook.eu2.make.com/lgaoguuofatr0ox3fvrjwyg7cr0mu5qn';

      fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_id: lead.id,
          name: lead.name,
          email: lead.email,
          country: lead.country || '',
          main_need: lead.main_need || '',
          urgency: lead.urgency || '',
          consent: lead.consent,
          source: lead.source,
          status: lead.status,
          created_at: lead.created_at,
          timestamp: new Date().toISOString(),
        })
      }).catch(err => {
        // Log error but don't fail the lead creation
        console.warn('Failed to trigger Make.com webhook:', err);
      });
    } catch (webhookError) {
      // Log error but don't fail the lead creation
      console.warn('Failed to call Make.com webhook:', webhookError);
    }

    return { data: lead as Lead, error: null };
  } catch (error) {
    console.error('Unexpected error inserting lead:', error);
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
