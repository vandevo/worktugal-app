import { supabase } from './supabase';
import type { AccountingIntakeData } from '../types/intake';

/**
 * Submit a comprehensive accounting intake
 * Phase 1 MVP: Captures full compliance data for manual review
 */
export async function submitAccountingIntake(data: Partial<AccountingIntakeData>) {
  const { data: intake, error } = await supabase
    .from('accounting_intakes')
    .insert([{
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      country: data.country || null,
      residency_status: data.residency_status || null,
      days_in_portugal: data.days_in_portugal || null,
      city: data.city || null,
      income_sources: data.income_sources || [],
      has_nif: data.has_nif ?? null,
      nif_number: data.nif_number || null,
      has_niss: data.has_niss ?? null,
      niss_number: data.niss_number || null,
      has_iban: data.has_iban ?? null,
      iban_number: data.iban_number || null,
      has_vat_number: data.has_vat_number ?? null,
      vat_regime: data.vat_regime || null,
      has_fiscal_representative: data.has_fiscal_representative ?? null,
      has_electronic_notifications: data.has_electronic_notifications ?? null,
      activity_opened: data.activity_opened ?? null,
      activity_code: data.activity_code || null,
      activity_date: data.activity_date || null,
      previous_accountant: data.previous_accountant ?? null,
      accounting_software: data.accounting_software || null,
      urgency_level: data.urgency_level || 'medium',
      biggest_worry: data.biggest_worry || null,
      special_notes: data.special_notes || null,
      files: data.files || {},
      status: 'new',
      tags: data.tags || []
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting intake:', error);
    throw new Error('Failed to submit intake. Please try again.');
  }

  // Trigger Make.com webhook for confirmation email (non-blocking)
  try {
    const makeWebhookUrl = import.meta.env.VITE_MAKE_INTAKE_WEBHOOK_URL;
    if (makeWebhookUrl) {
      // Fire and forget - don't block user flow if webhook fails
      fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'intake_submitted',
          intake_id: intake.id,
          name: intake.name,
          email: intake.email,
          urgency_level: intake.urgency_level,
          residency_status: intake.residency_status,
          has_nif: intake.has_nif,
          has_iban: intake.has_iban,
          has_vat_number: intake.has_vat_number,
          biggest_worry: intake.biggest_worry,
          created_at: intake.created_at
        })
      }).catch(err => {
        // Log but don't fail the submission
        console.error('Webhook notification failed:', err);
      });
    }
  } catch (err) {
    // Webhook errors should never block the user
    console.error('Error calling Make.com webhook:', err);
  }

  return intake;
}

/**
 * Get intake by email (for user to view their own)
 */
export async function getIntakesByEmail(email: string) {
  const { data, error } = await supabase
    .from('accounting_intakes')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching intakes:', error);
    throw new Error('Failed to fetch intakes');
  }

  return data;
}
