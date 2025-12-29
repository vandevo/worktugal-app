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
  interested_in_accounting_services: boolean;
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

interface LiveStats {
  totalSubmissions: number;
  uniqueUsers: number;
  pctNoActivity: number;
  pctNoNIF: number;
  pctNoNISS: number;
  pctNoVAT: number;
  pctInterestedInServices: number;
  avgRedFlags: number;
  avgMonthsInPortugal: number;
  incomeDistribution: {
    under_10k: number;
    '10k_25k': number;
    '25k_50k': number;
    over_50k: number;
  };
}

async function queryLiveStats(supabase: ReturnType<typeof createClient>): Promise<LiveStats> {
  try {
    const { data: allSubmissions } = await supabase
      .from('tax_checkup_leads')
      .select('id');

    const { data: latestSubmissions } = await supabase
      .from('tax_checkup_leads')
      .select(`
        activity_opened,
        has_nif,
        has_niss,
        has_vat_number,
        interested_in_accounting_services,
        compliance_score_red,
        months_in_portugal,
        estimated_annual_income
      `)
      .eq('is_latest_submission', true);

    const totalSubmissions = allSubmissions?.length || 0;
    const uniqueUsers = latestSubmissions?.length || 0;

    if (uniqueUsers === 0) {
      return {
        totalSubmissions: 0,
        uniqueUsers: 0,
        pctNoActivity: 0,
        pctNoNIF: 0,
        pctNoNISS: 0,
        pctNoVAT: 0,
        pctInterestedInServices: 0,
        avgRedFlags: 0,
        avgMonthsInPortugal: 0,
        incomeDistribution: { under_10k: 0, '10k_25k': 0, '25k_50k': 0, over_50k: 0 }
      };
    }

    const noActivity = latestSubmissions.filter(s => s.activity_opened === false).length;
    const noNIF = latestSubmissions.filter(s => s.has_nif === false).length;
    const noNISS = latestSubmissions.filter(s => s.has_niss === false).length;
    const noVAT = latestSubmissions.filter(s => s.has_vat_number === false).length;
    const interestedInServices = latestSubmissions.filter(s => s.interested_in_accounting_services === true).length;

    const totalRedFlags = latestSubmissions.reduce((sum, s) => sum + (s.compliance_score_red || 0), 0);
    const totalMonths = latestSubmissions.reduce((sum, s) => sum + (s.months_in_portugal || 0), 0);

    const incomeCounts = {
      under_10k: latestSubmissions.filter(s => s.estimated_annual_income === 'under_10k').length,
      '10k_25k': latestSubmissions.filter(s => s.estimated_annual_income === '10k_25k').length,
      '25k_50k': latestSubmissions.filter(s => s.estimated_annual_income === '25k_50k').length,
      over_50k: latestSubmissions.filter(s => s.estimated_annual_income === 'over_50k').length,
    };

    return {
      totalSubmissions,
      uniqueUsers,
      pctNoActivity: Math.round((noActivity / uniqueUsers) * 1000) / 10,
      pctNoNIF: Math.round((noNIF / uniqueUsers) * 1000) / 10,
      pctNoNISS: Math.round((noNISS / uniqueUsers) * 1000) / 10,
      pctNoVAT: Math.round((noVAT / uniqueUsers) * 1000) / 10,
      pctInterestedInServices: Math.round((interestedInServices / uniqueUsers) * 1000) / 10,
      avgRedFlags: Math.round((totalRedFlags / uniqueUsers) * 100) / 100,
      avgMonthsInPortugal: Math.round((totalMonths / uniqueUsers) * 10) / 10,
      incomeDistribution: {
        under_10k: Math.round((incomeCounts.under_10k / uniqueUsers) * 1000) / 10,
        '10k_25k': Math.round((incomeCounts['10k_25k'] / uniqueUsers) * 1000) / 10,
        '25k_50k': Math.round((incomeCounts['25k_50k'] / uniqueUsers) * 1000) / 10,
        over_50k: Math.round((incomeCounts.over_50k / uniqueUsers) * 1000) / 10,
      }
    };
  } catch (err) {
    console.error('Error querying live stats:', err);
    return {
      totalSubmissions: 0,
      uniqueUsers: 0,
      pctNoActivity: 0,
      pctNoNIF: 0,
      pctNoNISS: 0,
      pctNoVAT: 0,
      pctInterestedInServices: 0,
      avgRedFlags: 0,
      avgMonthsInPortugal: 0,
      incomeDistribution: { under_10k: 0, '10k_25k': 0, '25k_50k': 0, over_50k: 0 }
    };
  }
}

function generateDynamicInsights(
  submission: TaxCheckupSubmission,
  stats: LiveStats
): string {
  const insights: string[] = [];

  if (stats.totalSubmissions === 0) {
    return '';
  }

  insights.push(`Based on ${stats.totalSubmissions} checkups from ${stats.uniqueUsers} freelancers:`);

  if (submission.activity_opened === false && stats.pctNoActivity > 0) {
    insights.push(
      `- ${stats.pctNoActivity}% haven't opened activity yet - you're not alone, but this is the #1 issue we see`
    );
  }

  if (submission.has_nif === false && stats.pctNoNIF > 0) {
    if (stats.pctNoNIF < 15) {
      insights.push(
        `- Only ${stats.pctNoNIF}% of freelancers are missing NIF - prioritize this first`
      );
    } else {
      insights.push(
        `- ${stats.pctNoNIF}% of freelancers are also missing NIF - common issue but critical to fix`
      );
    }
  }

  if (submission.has_niss === false && stats.pctNoNISS > 0) {
    insights.push(
      `- ${stats.pctNoNISS}% of similar users also needed NISS registration`
    );
  }

  if (submission.compliance_score_red >= 2 && stats.avgRedFlags > 0) {
    insights.push(
      `- Your ${submission.compliance_score_red} critical issues vs average of ${stats.avgRedFlags} - prioritize urgent items first`
    );
  } else if (submission.compliance_score_red === 0 && stats.avgRedFlags > 0) {
    const pctBetterThan = Math.round((1 - (submission.compliance_score_red / Math.max(stats.avgRedFlags * 2, 1))) * 100);
    if (pctBetterThan > 50) {
      insights.push(
        `- Great news: You're ahead of ${Math.min(pctBetterThan, 95)}% of freelancers we've analyzed`
      );
    }
  }

  const userIncomeBracket = submission.estimated_annual_income;
  const userIncomePct = stats.incomeDistribution[userIncomeBracket as keyof typeof stats.incomeDistribution];
  if (userIncomePct && userIncomePct > 10) {
    insights.push(
      `- You're in the same income bracket as ${userIncomePct}% of our users`
    );
  }

  if (stats.pctInterestedInServices > 20 && submission.interested_in_accounting_services) {
    insights.push(
      `- ${stats.pctInterestedInServices}% of similar users requested professional help`
    );
  }

  if (insights.length <= 1) {
    return '';
  }

  return '\n\nINSIGHTS FROM REAL USERS:\n' + insights.join('\n');
}

function enhanceComplianceReport(
  originalReport: string,
  submission: TaxCheckupSubmission,
  stats: LiveStats
): string {
  const insightsMarker = '\n\nINSIGHTS FROM REAL USERS:';
  const disclaimerMarker = '\n\n---\n';

  let baseReport = originalReport;
  const insightsStart = originalReport.indexOf(insightsMarker);
  const disclaimerStart = originalReport.indexOf(disclaimerMarker);

  if (insightsStart !== -1 && disclaimerStart !== -1) {
    baseReport = originalReport.substring(0, insightsStart) + originalReport.substring(disclaimerStart);
  } else if (insightsStart !== -1) {
    baseReport = originalReport.substring(0, insightsStart);
  }

  const dynamicInsights = generateDynamicInsights(submission, stats);

  const finalDisclaimerStart = baseReport.indexOf(disclaimerMarker);
  if (finalDisclaimerStart !== -1) {
    return baseReport.substring(0, finalDisclaimerStart) + dynamicInsights + baseReport.substring(finalDisclaimerStart);
  }

  return baseReport + dynamicInsights;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const submission: TaxCheckupSubmission = await req.json();

    console.log('Received tax checkup submission:', submission.email);

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Handling deduplication for email_hash:', submission.email_hash);
    const { error: dedupeError } = await supabase
      .from('tax_checkup_leads')
      .update({ is_latest_submission: false })
      .eq('email_hash', submission.email_hash)
      .eq('is_latest_submission', true);

    if (dedupeError) {
      console.log('Deduplication update (non-blocking):', dedupeError.message);
    }

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
        interested_in_accounting_services: submission.interested_in_accounting_services || false,
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
        is_latest_submission: true,
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

    console.log('Querying live stats for dynamic insights...');
    const liveStats = await queryLiveStats(supabase);
    console.log('Live stats:', JSON.stringify(liveStats));

    const enhancedReport = enhanceComplianceReport(
      lead.compliance_report,
      submission,
      liveStats
    );
    console.log('Enhanced report generated with live stats');

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
          interested_in_accounting_services: lead.interested_in_accounting_services,
          compliance_score_red: lead.compliance_score_red,
          compliance_score_yellow: lead.compliance_score_yellow,
          compliance_score_green: lead.compliance_score_green,
          compliance_report: enhancedReport,
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
          live_stats: {
            total_submissions: liveStats.totalSubmissions,
            unique_users: liveStats.uniqueUsers,
            pct_no_activity: liveStats.pctNoActivity,
            pct_no_nif: liveStats.pctNoNIF,
            pct_interested_in_services: liveStats.pctInterestedInServices,
            avg_red_flags: liveStats.avgRedFlags
          }
        }),
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