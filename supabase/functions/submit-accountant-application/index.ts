import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface AccountantApplicationSubmission {
  full_name: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  occ_number: string | null;
  has_occ: boolean;
  experience_years: string;
  english_fluency: string;
  portuguese_fluency: string;
  specializations: string[];
  bio: string;
  availability: string;
  why_worktugal: string;
  resume_url: string | null;
  resume_path: string | null;
  current_freelancer_clients: string;
  foreign_client_percentage: string;
  preferred_communication: string;
  accepts_triage_role: string;
  vat_scenario_answer: string;
  partnership_interest_level: string;
}

function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const submission: AccountantApplicationSubmission = await req.json();

    console.log('Received accountant application submission:', submission.email);

    if (!submission.full_name || !submission.email || !submission.experience_years) {
      console.error('Validation failed:', {
        full_name: submission.full_name,
        email: submission.email,
        experience_years: submission.experience_years
      });
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: full_name, email, and experience_years are required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const certifications = submission.occ_number ? [
      {
        name: 'OCC',
        number: submission.occ_number,
        expiry: null,
      }
    ] : [];

    const experienceYears = parseInt(submission.experience_years.replace('+', '')) || 0;

    const combinedBio = submission.bio
      ? `${submission.bio}\n\n---\nLanguages: English (${submission.english_fluency}), Portuguese (${submission.portuguese_fluency})\nAvailability: ${submission.availability}\n\n---\nWhy Worktugal:\n${submission.why_worktugal}`
      : `Languages: English (${submission.english_fluency}), Portuguese (${submission.portuguese_fluency})\nAvailability: ${submission.availability}\n\n---\nWhy Worktugal:\n${submission.why_worktugal}`;

    console.log('Inserting accountant application into database...');
    const { data: application, error: dbError } = await supabase
      .from('accountant_applications')
      .insert({
        full_name: submission.full_name,
        email: submission.email.toLowerCase().trim(),
        phone: submission.phone,
        linkedin_url: submission.linkedin_url,
        website_url: submission.website_url,
        bio: combinedBio,
        experience_years: experienceYears,
        specializations: submission.specializations,
        certifications: certifications,
        resume_url: submission.resume_url,
        resume_path: submission.resume_path,
        status: 'pending',
        current_freelancer_clients: submission.current_freelancer_clients,
        foreign_client_percentage: submission.foreign_client_percentage,
        preferred_communication: submission.preferred_communication,
        accepts_triage_role: submission.accepts_triage_role,
        vat_scenario_answer: submission.vat_scenario_answer,
        partnership_interest_level: submission.partnership_interest_level,
        english_fluency: submission.english_fluency,
        portuguese_fluency: submission.portuguese_fluency,
        availability: submission.availability,
        why_worktugal: submission.why_worktugal,
        has_occ: submission.has_occ,
        occ_number: submission.occ_number,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return new Response(
        JSON.stringify({
          error: 'Failed to save accountant application',
          details: dbError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Accountant application saved to database:', application.id);

    const makeWebhookUrl = 'https://hook.eu2.make.com/hmq8w79pv7hv6q95r36vpi5kr92rpdgy';

    try {
      console.log('Sending to Make.com webhook...');
      const makePayload = {
        id: application.id,
        created_at: application.created_at,
        full_name: application.full_name,
        email: application.email,
        phone: application.phone || '',
        linkedin_url: application.linkedin_url || '',
        website_url: application.website_url || '',
        has_occ: application.has_occ,
        occ_number: application.occ_number || '',
        experience_years: application.experience_years,
        english_fluency: application.english_fluency || '',
        portuguese_fluency: application.portuguese_fluency || '',
        specializations: (application.specializations || []).join(', '),
        specializations_count: (application.specializations || []).length,
        availability: application.availability || '',
        current_freelancer_clients: application.current_freelancer_clients || '',
        foreign_client_percentage: application.foreign_client_percentage || '',
        preferred_communication: application.preferred_communication || '',
        accepts_triage_role: application.accepts_triage_role || '',
        partnership_interest_level: application.partnership_interest_level || '',
        vat_scenario_answer: truncateText(application.vat_scenario_answer || '', 500),
        why_worktugal: truncateText(application.why_worktugal || '', 500),
        bio: truncateText(application.bio || '', 500),
        resume_url: application.resume_url || '',
        status: application.status,
        timestamp: new Date().toISOString(),
        source: 'accountant_application_form',
      };

      console.log('Payload size estimate:', JSON.stringify(makePayload).length, 'bytes');

      const makeResponse = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(makePayload),
      });

      if (!makeResponse.ok) {
        const errorText = await makeResponse.text();
        console.error('Make.com webhook failed:', makeResponse.status, errorText);
      } else {
        console.log('Successfully sent to Make.com webhook');
      }
    } catch (webhookError) {
      console.error('Failed to call Make.com webhook:', webhookError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: application,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});