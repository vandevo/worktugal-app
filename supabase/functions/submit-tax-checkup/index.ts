import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface TaxCheckupSubmission {
  work_type: string;
  months_in_portugal: number;
  residency_status: string;
  has_nif: boolean | null;
  activity_opened: boolean | null;
  estimated_annual_income: string;
  has_vat_number: boolean | null;
  has_niss: boolean | null;
  has_fiscal_representative: boolean | null;
  email: string;
  name?: string;
  phone?: string;
  email_marketing_consent: boolean;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  compliance_score_red: number;
  compliance_score_yellow: number;
  compliance_score_green: number;
  compliance_report: string;
  lead_quality_score: number;
  email_hash: string;
  is_latest_submission?: boolean;
  submission_sequence?: number;
  previous_submission_id?: number;
  first_submission_at?: string;
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
    // Parse the tax checkup submission
    const submission: TaxCheckupSubmission = await req.json();

    console.log('Received tax checkup submission:', submission.email);

    // Validate required fields
    if (!submission.work_type || !submission.email || !submission.estimated_annual_income) {
      console.error('Validation failed:', {
        work_type: submission.work_type,
        email: submission.email,
        estimated_annual_income: submission.estimated_annual_income
      });
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: work_type, email, and estimated_annual_income are required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert tax checkup lead into database
    console.log('Inserting tax checkup lead into database...');
    const { data: lead, error: dbError } = await supabase
      .from('tax_checkup_leads')
      .insert({
        name: submission.name || '',
        email: submission.email,
        phone: submission.phone || null,
        work_type: submission.work_type,
        months_in_portugal: submission.months_in_portugal,
        residency_status: submission.residency_status || null,
        has_nif: submission.has_nif,
        activity_opened: submission.activity_opened,
        estimated_annual_income: submission.estimated_annual_income,
        has_vat_number: submission.has_vat_number,
        has_niss: submission.has_niss,
        has_fiscal_representative: submission.has_fiscal_representative,
        email_marketing_consent: submission.email_marketing_consent || false,
        utm_source: submission.utm_source || null,
        utm_campaign: submission.utm_campaign || null,
        utm_medium: submission.utm_medium || null,
        compliance_score_red: submission.compliance_score_red,
        compliance_score_yellow: submission.compliance_score_yellow,
        compliance_score_green: submission.compliance_score_green,
        compliance_report: submission.compliance_report,
        lead_quality_score: submission.lead_quality_score,
        status: 'new',
        email_hash: submission.email_hash,
        is_latest_submission: submission.is_latest_submission ?? true,
        submission_sequence: submission.submission_sequence ?? 1,
        previous_submission_id: submission.previous_submission_id || null,
        first_submission_at: submission.first_submission_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return new Response(
        JSON.stringify({
          error: 'Failed to save tax checkup lead',
          details: dbError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Tax checkup lead saved to database:', lead.id);

    // Send to Make.com webhook
    const makeWebhookUrl = 'https://hook.eu2.make.com/y1fpmxf85vp5rmqlfv9fj3s54gm5w88y';

    try {
      console.log('Sending to Make.com webhook...');
      const makeResponse = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: lead.id,
          email: lead.email,
          name: lead.name || '',
          phone: lead.phone || '',
          work_type: lead.work_type,
          months_in_portugal: lead.months_in_portugal,
          residency_status: lead.residency_status || '',
          has_nif: lead.has_nif,
          activity_opened: lead.activity_opened,
          estimated_annual_income: lead.estimated_annual_income,
          has_vat_number: lead.has_vat_number,
          has_niss: lead.has_niss,
          has_fiscal_representative: lead.has_fiscal_representative,
          email_marketing_consent: lead.email_marketing_consent,
          compliance_score_red: lead.compliance_score_red,
          compliance_score_yellow: lead.compliance_score_yellow,
          compliance_score_green: lead.compliance_score_green,
          compliance_report: lead.compliance_report,
          lead_quality_score: lead.lead_quality_score,
          utm_source: lead.utm_source || '',
          utm_campaign: lead.utm_campaign || '',
          utm_medium: lead.utm_medium || '',
          status: lead.status,
          is_resubmission: (submission.submission_sequence ?? 1) > 1,
          submission_sequence: lead.submission_sequence,
          created_at: lead.created_at,
          timestamp: new Date().toISOString(),
          source: 'tax_checkup_wizard',
        }),
      });

      if (!makeResponse.ok) {
        console.error('Make.com webhook failed:', makeResponse.status);
      } else {
        console.log('Successfully sent to Make.com');
      }
    } catch (webhookError) {
      console.error('Failed to call Make.com webhook:', webhookError);
      // Don't fail the request - data is already saved
    }

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        data: lead,
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
