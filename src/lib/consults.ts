import { supabase } from './supabase';
import type { ConsultBooking, ServiceType, ConsultStatus } from '../types/accounting';

export async function createConsultBooking(data: {
  service_type: ServiceType;
  full_name: string;
  email: string;
  phone?: string;
  preferred_date?: string;
  notes?: string;
}): Promise<{ data: ConsultBooking | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data: booking, error } = await supabase
      .from('partner_submissions')
      .insert({
        user_id: user.id,
        submission_type: 'consult',
        service_type: data.service_type,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        preferred_date: data.preferred_date,
        notes: data.notes,
        status: 'pending_payment'
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating consult booking:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: booking as ConsultBooking, error: null };
  } catch (error) {
    console.error('Unexpected error creating consult booking:', error);
    return { data: null, error: error as Error };
  }
}

export async function getConsultBooking(id: number): Promise<{ data: ConsultBooking | null; error: Error | null }> {
  try {
    const { data: booking, error } = await supabase
      .from('partner_submissions')
      .select('*')
      .eq('id', id)
      .eq('submission_type', 'consult')
      .maybeSingle();

    if (error) {
      console.error('Error fetching consult booking:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: booking as ConsultBooking, error: null };
  } catch (error) {
    console.error('Unexpected error fetching consult booking:', error);
    return { data: null, error: error as Error };
  }
}

export async function getUserConsultBookings(): Promise<{ data: ConsultBooking[] | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data: bookings, error } = await supabase
      .from('partner_submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('submission_type', 'consult')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user consult bookings:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: bookings as ConsultBooking[], error: null };
  } catch (error) {
    console.error('Unexpected error fetching user consult bookings:', error);
    return { data: null, error: error as Error };
  }
}

export async function updateConsultStatus(
  id: number,
  status: ConsultStatus,
  outcome_url?: string
): Promise<{ data: ConsultBooking | null; error: Error | null }> {
  try {
    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (outcome_url) {
      updateData.outcome_url = outcome_url;
    }

    const { data: booking, error } = await supabase
      .from('partner_submissions')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating consult status:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: booking as ConsultBooking, error: null };
  } catch (error) {
    console.error('Unexpected error updating consult status:', error);
    return { data: null, error: error as Error };
  }
}
