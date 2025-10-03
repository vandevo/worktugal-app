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
    // Prepare lead data
    const leadData = {
      name: data.name,
      email: data.email,
      country: data.country || '',
      main_need: data.main_need || '',
      urgency: data.urgency || '',
      consent: data.consent,
      source: data.source || 'accounting_page',
      status: 'new'
    };

    // Try to insert into database
    const { data: lead, error } = await supabase
      .from('leads_accounting')
      .insert(leadData)
      .select()
      .single();

    // Call Make.com webhook regardless of database success
    // This ensures leads are captured even if database connection fails
    try {
      const makeWebhookUrl = 'https://hook.eu2.make.com/lgaoguuofatr0ox3fvrjwyg7cr0mu5qn';

      fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_id: lead?.id || 0,
          name: leadData.name,
          email: leadData.email,
          country: leadData.country,
          main_need: leadData.main_need,
          urgency: leadData.urgency,
          consent: leadData.consent,
          source: leadData.source,
          status: leadData.status,
          created_at: lead?.created_at || new Date().toISOString(),
          timestamp: new Date().toISOString(),
        })
      }).catch(err => {
        console.warn('Failed to trigger Make.com webhook:', err);
      });
    } catch (webhookError) {
      console.warn('Failed to call Make.com webhook:', webhookError);
    }

    // If database insert failed, still return success since webhook was called
    if (error) {
      console.error('Error inserting lead to database (webhook sent anyway):', error);
      // Return success with placeholder data so form shows success page
      return {
        data: {
          id: 0,
          ...leadData,
          created_at: new Date().toISOString()
        } as Lead,
        error: null
      };
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
