import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CalComBooking {
  uid: string;
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  attendees: Array<{
    email: string;
    name: string;
    timeZone: string;
  }>;
  organizer: {
    email: string;
    name: string;
    timeZone: string;
  };
  metadata?: Record<string, any>;
  rescheduleUid?: string;
  status?: string;
}

interface CalComWebhookPayload {
  triggerEvent: string;
  payload: CalComBooking;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse webhook payload
    const webhookData: CalComWebhookPayload = await req.json();
    const { triggerEvent, payload } = webhookData;

    console.log('Cal.com webhook received:', triggerEvent, payload?.uid);

    // Handle ping test from Cal.com
    if (triggerEvent === 'PING' || !payload) {
      return new Response(
        JSON.stringify({ message: 'Webhook endpoint is active', status: 'ok' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find client by email from attendees
    const clientEmail = payload.attendees[0]?.email;
    if (!clientEmail) {
      throw new Error('No client email found in booking');
    }

    // Get client user ID
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(clientEmail);
    if (authError || !authUser) {
      console.error('Client not found:', clientEmail);
      return new Response(
        JSON.stringify({ error: 'Client not found', email: clientEmail }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const clientId = authUser.user.id;

    // Handle different webhook events
    switch (triggerEvent) {
      case 'BOOKING_CREATED': {
        // Check if appointment already exists
        const { data: existing } = await supabase
          .from('appointments')
          .select('id')
          .eq('cal_booking_uid', payload.uid)
          .maybeSingle();

        if (existing) {
          console.log('Appointment already exists:', payload.uid);
          return new Response(
            JSON.stringify({ message: 'Appointment already exists', id: existing.id }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Create new appointment
        const { data: appointment, error: insertError } = await supabase
          .from('appointments')
          .insert({
            client_id: clientId,
            cal_booking_uid: payload.uid,
            cal_event_id: payload.id.toString(),
            scheduled_date: payload.startTime,
            duration_minutes: Math.round((new Date(payload.endTime).getTime() - new Date(payload.startTime).getTime()) / 60000),
            status: 'scheduled',
            service_type: 'consult', // Default service type
            cal_attendees: payload.attendees,
            cal_metadata: payload.metadata || {},
            cal_webhook_received_at: new Date().toISOString(),
            meeting_url: payload.metadata?.videoCallUrl || null,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating appointment:', insertError);
          throw insertError;
        }

        console.log('Appointment created:', appointment.id);
        return new Response(
          JSON.stringify({ message: 'Appointment created', appointment }),
          {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'BOOKING_RESCHEDULED': {
        // Find existing appointment
        const { data: appointment, error: findError } = await supabase
          .from('appointments')
          .select('id')
          .eq('cal_booking_uid', payload.rescheduleUid || payload.uid)
          .maybeSingle();

        if (findError || !appointment) {
          console.error('Appointment not found for reschedule:', payload.uid);
          // Create new appointment if not found
          const { data: newAppointment, error: insertError } = await supabase
            .from('appointments')
            .insert({
              client_id: clientId,
              cal_booking_uid: payload.uid,
              cal_event_id: payload.id.toString(),
              scheduled_date: payload.startTime,
              duration_minutes: Math.round((new Date(payload.endTime).getTime() - new Date(payload.startTime).getTime()) / 60000),
              status: 'scheduled',
              service_type: 'consult',
              cal_attendees: payload.attendees,
              cal_metadata: payload.metadata || {},
              cal_webhook_received_at: new Date().toISOString(),
              cal_reschedule_uid: payload.rescheduleUid,
              meeting_url: payload.metadata?.videoCallUrl || null,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          return new Response(
            JSON.stringify({ message: 'Appointment created from reschedule', appointment: newAppointment }),
            {
              status: 201,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Update existing appointment
        const { error: updateError } = await supabase
          .from('appointments')
          .update({
            cal_booking_uid: payload.uid,
            cal_event_id: payload.id.toString(),
            scheduled_date: payload.startTime,
            duration_minutes: Math.round((new Date(payload.endTime).getTime() - new Date(payload.startTime).getTime()) / 60000),
            status: 'rescheduled',
            cal_attendees: payload.attendees,
            cal_metadata: payload.metadata || {},
            cal_webhook_received_at: new Date().toISOString(),
            cal_reschedule_uid: payload.rescheduleUid,
            meeting_url: payload.metadata?.videoCallUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', appointment.id);

        if (updateError) throw updateError;

        console.log('Appointment rescheduled:', appointment.id);
        return new Response(
          JSON.stringify({ message: 'Appointment rescheduled', id: appointment.id }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'BOOKING_CANCELLED': {
        // Find and update appointment
        const { error: updateError } = await supabase
          .from('appointments')
          .update({
            status: 'cancelled',
            cal_webhook_received_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('cal_booking_uid', payload.uid);

        if (updateError) throw updateError;

        console.log('Appointment cancelled:', payload.uid);
        return new Response(
          JSON.stringify({ message: 'Appointment cancelled' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'BOOKING_REQUESTED': {
        // Similar to BOOKING_CREATED but with pending status
        const { data: existing } = await supabase
          .from('appointments')
          .select('id')
          .eq('cal_booking_uid', payload.uid)
          .maybeSingle();

        if (existing) {
          return new Response(
            JSON.stringify({ message: 'Appointment already exists', id: existing.id }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { data: appointment, error: insertError } = await supabase
          .from('appointments')
          .insert({
            client_id: clientId,
            cal_booking_uid: payload.uid,
            cal_event_id: payload.id.toString(),
            scheduled_date: payload.startTime,
            duration_minutes: Math.round((new Date(payload.endTime).getTime() - new Date(payload.startTime).getTime()) / 60000),
            status: 'pending_assignment',
            service_type: 'consult',
            cal_attendees: payload.attendees,
            cal_metadata: payload.metadata || {},
            cal_webhook_received_at: new Date().toISOString(),
            meeting_url: payload.metadata?.videoCallUrl || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        return new Response(
          JSON.stringify({ message: 'Appointment request created', appointment }),
          {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'MEETING_STARTED': {
        const { error: updateError } = await supabase
          .from('appointments')
          .update({
            consultation_started_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('cal_booking_uid', payload.uid);

        if (updateError) throw updateError;

        return new Response(
          JSON.stringify({ message: 'Meeting started tracked' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'MEETING_ENDED': {
        const { error: updateError } = await supabase
          .from('appointments')
          .update({
            consultation_completed_at: new Date().toISOString(),
            status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('cal_booking_uid', payload.uid);

        if (updateError) throw updateError;

        return new Response(
          JSON.stringify({ message: 'Meeting ended tracked' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      default: {
        console.log('Unhandled webhook event:', triggerEvent);
        return new Response(
          JSON.stringify({ message: 'Event received but not handled', event: triggerEvent }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
