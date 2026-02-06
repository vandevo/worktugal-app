import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const PARALLEL_API_KEY = Deno.env.get('PARALLEL_API_KEY') ?? '';
const PARALLEL_SEARCH_URL = 'https://api.parallel.ai/v1beta/search';

// ============================================================================
// TYPES
// ============================================================================

interface ResearchQuery {
  area: string;
  objective: string;
  search_queries: string[];
}

interface SearchResult {
  url: string;
  title: string;
  publish_date: string | null;
  excerpts: string[];
}

interface AreaResearchResult {
  area: string;
  user_situation: string;
  results: SearchResult[];
  error?: string;
}

// ============================================================================
// FORM DATA LABELS (for readable draft)
// ============================================================================

const DURATION_LABELS: Record<string, string> = {
  'less_than_183_days': 'Less than 183 days',
  '183_days_or_more': '183 days or more',
  'permanent': 'Permanent',
  'not_sure': 'Not sure',
};

const ACCOMMODATION_LABELS: Record<string, string> = {
  'own_property': 'Own property',
  'long_term_lease': 'Long-term lease',
  'short_term_rental': 'Short-term rental',
  'no_accommodation': 'No accommodation',
};

const TURNOVER_LABELS: Record<string, string> = {
  'under_15k': 'Under €15,000',
  '15k_25k': '€15,000 - €25,000',
  '25k_50k': '€25,000 - €50,000',
  'over_50k': 'Over €50,000',
};

const VAT_LABELS: Record<string, string> = {
  'yes': 'Yes, VAT registered',
  'no': 'No (using Article 53 exemption)',
  'not_applicable': 'Not applicable',
  'not_sure': 'Not sure',
};

const WORK_TYPE_LABELS: Record<string, string> = {
  'software_dev': 'Software Development',
  'consulting': 'Consulting',
  'design': 'Design',
  'marketing': 'Marketing',
  'content_creation': 'Content Creation',
  'teaching': 'Teaching',
  'healthcare': 'Healthcare',
  'legal_financial': 'Legal/Financial',
  'other': 'Other',
};

const CRYPTO_LABELS: Record<string, string> = {
  'no': 'No crypto activity',
  'holding_only': 'Holding only (no trades)',
  'occasional': 'Occasional trading',
  'active_trading': 'Active trading',
};

const NHR_LABELS: Record<string, string> = {
  'nhr_active': 'NHR active',
  'ifici_applied': 'IFICI applied',
  'not_applied': 'Not applied',
  'not_eligible': 'Not eligible',
  'not_sure': 'Not sure',
};

// ============================================================================
// BUILD RESEARCH QUERIES FROM FORM DATA
// ============================================================================

function buildResearchQueries(formData: Record<string, any>): ResearchQuery[] {
  const queries: ResearchQuery[] = [];
  const currentYear = new Date().getFullYear();

  // 1. TAX RESIDENCY — always relevant for foreign freelancers in Portugal
  queries.push({
    area: 'Tax Residency',
    objective: `Current Portugal tax residency rules ${currentYear} for foreign freelancers. When does someone become a tax resident? Include the 183-day rule, habitual abode rule, and how lease/property ownership affects residency determination. Prefer official Portuguese tax authority (Autoridade Tributária) sources.`,
    search_queries: [
      `Portugal tax residency 183 day rule ${currentYear} Autoridade Tributária`,
      `Portugal habitual abode tax resident foreign freelancer ${currentYear}`,
    ],
  });

  // 2. VAT COMPLIANCE — if income suggests VAT may be relevant
  const turnover = formData.estimated_annual_turnover;
  if (turnover && turnover !== 'under_15k') {
    queries.push({
      area: 'VAT Compliance',
      objective: `Portugal VAT registration requirements ${currentYear} for self-employed freelancers. Current Article 53 exemption threshold (€15,000), when mandatory registration applies, quarterly VAT return requirements introduced July 2025, and penalties for late registration. Prefer Portal das Finanças sources.`,
      search_queries: [
        `Portugal VAT registration threshold freelancer ${currentYear} Article 53`,
        `Portugal quarterly VAT return self-employed ${currentYear}`,
      ],
    });
  }

  // 3. SOCIAL SECURITY (NISS) — if not registered or unsure
  const niss = formData.social_security_registered;
  if (niss === 'no' || niss === 'not_sure') {
    queries.push({
      area: 'Social Security (NISS)',
      objective: `Portugal social security (Segurança Social) registration requirements ${currentYear} for self-employed freelancers. Include NISS registration deadlines, first-year exemption period, quarterly declaration schedule (April/July/October/January), monthly contribution rates, and consequences of non-registration for residence permit renewal (AIMA). Prefer Segurança Social Direta sources.`,
      search_queries: [
        `Portugal NISS social security self-employed freelancer registration ${currentYear}`,
        `Portugal Segurança Social quarterly declarations contributions ${currentYear}`,
      ],
    });
  }

  // 4. NHR / IFICI — if user applied or has active status
  const nhr = formData.nhr_ifici_applied;
  if (nhr && nhr !== 'not_applied' && nhr !== 'not_eligible') {
    queries.push({
      area: 'NHR/IFICI Tax Regime',
      objective: `Portugal NHR and IFICI tax regime rules ${currentYear}. NHR was closed January 1 2024. What is the IFICI replacement? Current eligibility requirements, application process, benefits for freelancers, and key differences from old NHR. Prefer official AT (Autoridade Tributária) sources.`,
      search_queries: [
        `Portugal IFICI tax regime ${currentYear} eligibility requirements freelancer`,
        `Portugal NHR closed IFICI replacement ${currentYear}`,
      ],
    });
  }

  // 5. CROSS-BORDER EXPOSURE — if dual residency or foreign social security
  const crossBorder =
    formData.other_tax_residencies === 'yes' ||
    formData.foreign_social_security === 'yes' ||
    (formData.a1_certificate_status && formData.a1_certificate_status !== 'yes' && formData.a1_certificate_status !== 'not_applicable');
  if (crossBorder) {
    queries.push({
      area: 'Cross-Border Tax Exposure',
      objective: `Portugal double taxation agreements and social security coordination ${currentYear}. How tie-breaker rules work for dual tax residents. A1 certificate requirements for EU social security coordination. Risk of paying social security in two countries. Prefer official OECD or AT sources.`,
      search_queries: [
        `Portugal double taxation agreement tie-breaker rules ${currentYear}`,
        `EU A1 certificate social security coordination Portugal freelancer`,
      ],
    });
  }

  // 6. CRYPTOCURRENCY — if active trading
  const crypto = formData.crypto_activity;
  if (crypto && crypto !== 'no' && crypto !== 'holding_only') {
    queries.push({
      area: 'Cryptocurrency Taxation',
      objective: `Portugal cryptocurrency tax rules ${currentYear}. Capital gains tax on crypto held less than 365 days (28% rate introduced 2023). Reporting requirements for freelancers who trade crypto. How crypto income is classified for IRS purposes. Prefer official AT sources.`,
      search_queries: [
        `Portugal cryptocurrency tax ${currentYear} capital gains 365 days 28 percent`,
        `Portugal crypto tax reporting requirements freelancer ${currentYear}`,
      ],
    });
  }

  return queries;
}

// ============================================================================
// CALL PARALLEL.AI SEARCH API
// ============================================================================

async function searchParallel(query: ResearchQuery): Promise<AreaResearchResult> {
  const userSituation = query.area; // Will be enriched in buildDraftReport

  try {
    const response = await fetch(PARALLEL_SEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PARALLEL_API_KEY,
        'parallel-beta': 'search-extract-2025-10-10',
      },
      body: JSON.stringify({
        objective: query.objective,
        search_queries: query.search_queries,
        max_results: 5,
        excerpts: {
          max_chars_per_result: 3000,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Parallel.ai search failed for ${query.area}:`, response.status, errText);
      return {
        area: query.area,
        user_situation: '',
        results: [],
        error: `Search failed: ${response.status}`,
      };
    }

    const data = await response.json();
    const results: SearchResult[] = (data.results || []).map((r: any) => ({
      url: r.url,
      title: r.title,
      publish_date: r.publish_date,
      excerpts: r.excerpts || [],
    }));

    return {
      area: query.area,
      user_situation: '',
      results,
    };
  } catch (err: any) {
    console.error(`Parallel.ai search error for ${query.area}:`, err.message);
    return {
      area: query.area,
      user_situation: '',
      results: [],
      error: err.message,
    };
  }
}

// ============================================================================
// BUILD USER SITUATION SUMMARY PER AREA
// ============================================================================

function getUserSituation(area: string, formData: Record<string, any>): string {
  const lines: string[] = [];

  switch (area) {
    case 'Tax Residency':
      if (formData.arrival_date) lines.push(`Arrival date: ${formData.arrival_date}`);
      lines.push(`Intended stay: ${DURATION_LABELS[formData.intended_duration] || formData.intended_duration || 'Not specified'}`);
      lines.push(`Accommodation: ${ACCOMMODATION_LABELS[formData.accommodation_type] || formData.accommodation_type || 'Not specified'}`);
      if (formData.lease_start_date) lines.push(`Lease start: ${formData.lease_start_date}`);
      if (formData.previous_tax_residency?.length) lines.push(`Previous tax residencies: ${formData.previous_tax_residency.join(', ')}`);
      break;

    case 'VAT Compliance':
      lines.push(`Estimated turnover: ${TURNOVER_LABELS[formData.estimated_annual_turnover] || formData.estimated_annual_turnover || 'Not specified'}`);
      lines.push(`VAT registered: ${VAT_LABELS[formData.vat_registration_status] || formData.vat_registration_status || 'Not specified'}`);
      lines.push(`Client location: ${formData.client_location || 'Not specified'}`);
      lines.push(`Client type: ${formData.client_type || 'Not specified'}`);
      break;

    case 'Social Security (NISS)':
      lines.push(`NISS registered: ${formData.social_security_registered || 'Not specified'}`);
      lines.push(`Quarterly declarations filed: ${formData.quarterly_declarations_filed || 'Not specified'}`);
      break;

    case 'NHR/IFICI Tax Regime':
      lines.push(`NHR/IFICI status: ${NHR_LABELS[formData.nhr_ifici_applied] || formData.nhr_ifici_applied || 'Not specified'}`);
      if (formData.nhr_ifici_application_date) lines.push(`Application date: ${formData.nhr_ifici_application_date}`);
      break;

    case 'Cross-Border Tax Exposure':
      lines.push(`Other tax residencies: ${formData.other_tax_residencies || 'Not specified'}`);
      lines.push(`A1 certificate: ${formData.a1_certificate_status || 'Not specified'}`);
      lines.push(`Foreign social security: ${formData.foreign_social_security || 'Not specified'}`);
      break;

    case 'Cryptocurrency Taxation':
      lines.push(`Crypto activity: ${CRYPTO_LABELS[formData.crypto_activity] || formData.crypto_activity || 'Not specified'}`);
      break;
  }

  return lines.join('\n  ');
}

// ============================================================================
// TRUNCATE EXCERPTS FOR DRAFT (keep readable, not overwhelming)
// ============================================================================

function truncateExcerpt(text: string, maxLen: number = 500): string {
  if (!text || text.length <= maxLen) return text || '';
  // Cut at last sentence boundary before maxLen
  const truncated = text.substring(0, maxLen);
  const lastPeriod = truncated.lastIndexOf('.');
  if (lastPeriod > maxLen * 0.5) {
    return truncated.substring(0, lastPeriod + 1);
  }
  return truncated + '...';
}

// ============================================================================
// BUILD DRAFT REPORT
// ============================================================================

function buildDraftReport(
  review: Record<string, any>,
  formData: Record<string, any>,
  researchResults: AreaResearchResult[]
): string {
  const lines: string[] = [];

  lines.push('COMPLIANCE REVIEW — AI RESEARCH DRAFT');
  lines.push('======================================');
  lines.push(`Customer: ${review.customer_name || 'N/A'} (${review.customer_email})`);
  lines.push(`Review ID: ${review.id}`);
  lines.push(`Work type: ${WORK_TYPE_LABELS[formData.work_type] || formData.work_type || 'N/A'}`);
  lines.push(`Researched: ${new Date().toISOString()}`);
  lines.push('');

  const escalationFlags = review.escalation_flags || [];
  const ambiguityScore = review.ambiguity_score || 0;
  if (escalationFlags.length > 0) {
    lines.push(`ESCALATION FLAGS (${escalationFlags.length}):`);
    for (const flag of escalationFlags) {
      lines.push(`  - ${typeof flag === 'string' ? flag : (flag.type || flag.id || JSON.stringify(flag))}`);
    }
    lines.push('');
  }
  if (ambiguityScore > 0) {
    lines.push(`AMBIGUITY: ${ambiguityScore} "Not sure" answers — may need clarification`);
    lines.push('');
  }

  lines.push('REGULATORY AREAS RESEARCHED:');
  lines.push('');

  for (let i = 0; i < researchResults.length; i++) {
    const area = researchResults[i];
    const situation = getUserSituation(area.area, formData);

    lines.push(`--------------------------------------`);
    lines.push(`${i + 1}. ${area.area.toUpperCase()}`);
    lines.push(`--------------------------------------`);
    lines.push(`User situation:`);
    lines.push(`  ${situation}`);
    lines.push('');

    if (area.error) {
      lines.push(`  [Research failed: ${area.error}]`);
      lines.push('');
      continue;
    }

    if (area.results.length === 0) {
      lines.push(`  [No results found]`);
      lines.push('');
      continue;
    }

    lines.push('Key findings from web research:');
    for (const result of area.results.slice(0, 3)) {
      const excerpt = result.excerpts?.[0] ? truncateExcerpt(result.excerpts[0], 400) : '';
      if (excerpt) {
        lines.push(`  > ${excerpt}`);
      }
    }
    lines.push('');
    lines.push('Sources:');
    for (const result of area.results.slice(0, 3)) {
      const dateStr = result.publish_date ? ` (${result.publish_date})` : '';
      lines.push(`  - ${result.url} — ${result.title}${dateStr}`);
    }
    lines.push('');
  }

  lines.push('--------------------------------------');
  lines.push('DISCLAIMER');
  lines.push('--------------------------------------');
  lines.push('AI-generated draft from Parallel.ai web research.');
  lines.push('This is not legal or tax advice.');
  lines.push('Human review is required before delivery to customer.');
  lines.push('Information sourced from official Portuguese authorities where available.');
  lines.push('Final decisions should be confirmed with a licensed professional.');

  return lines.join('\n');
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate API key is configured
    if (!PARALLEL_API_KEY) {
      console.error('PARALLEL_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI research service not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { review_id } = await req.json();

    if (!review_id) {
      return new Response(
        JSON.stringify({ error: 'Missing review_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting AI research for review: ${review_id}`);

    // 1. Mark research as pending
    await supabase
      .from('paid_compliance_reviews')
      .update({
        ai_research_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', review_id);

    // 2. Fetch the review
    const { data: review, error: fetchError } = await supabase
      .from('paid_compliance_reviews')
      .select('*')
      .eq('id', review_id)
      .maybeSingle();

    if (fetchError || !review) {
      console.error('Review not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Review not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = review.form_data || {};

    // 3. Build research queries based on user's specific situation
    const queries = buildResearchQueries(formData);
    console.log(`Built ${queries.length} research queries for review ${review_id}:`, queries.map(q => q.area));

    if (queries.length === 0) {
      console.log('No research queries needed, skipping');
      await supabase
        .from('paid_compliance_reviews')
        .update({
          ai_research_status: 'completed',
          ai_research_results: { queries: [], results: [], note: 'No applicable research areas' },
          ai_draft_report: 'No applicable research areas identified from form data.',
          ai_researched_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', review_id);

      return new Response(
        JSON.stringify({ success: true, review_id, areas_researched: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Execute all searches in parallel
    console.log('Executing parallel Parallel.ai searches...');
    const researchResults = await Promise.all(queries.map(q => searchParallel(q)));

    const successCount = researchResults.filter(r => !r.error).length;
    const failCount = researchResults.filter(r => r.error).length;
    console.log(`Research complete: ${successCount} succeeded, ${failCount} failed`);

    // 5. Build draft report
    const draftReport = buildDraftReport(review, formData, researchResults);

    // 6. Prepare raw results for storage
    const rawResults = {
      researched_at: new Date().toISOString(),
      queries_count: queries.length,
      success_count: successCount,
      fail_count: failCount,
      areas: researchResults.map(r => ({
        area: r.area,
        error: r.error || null,
        results_count: r.results.length,
        results: r.results.map(sr => ({
          url: sr.url,
          title: sr.title,
          publish_date: sr.publish_date,
          excerpts: sr.excerpts,
        })),
      })),
    };

    // 7. Save to database
    const { error: updateError } = await supabase
      .from('paid_compliance_reviews')
      .update({
        ai_research_results: rawResults,
        ai_draft_report: draftReport,
        ai_research_status: 'completed',
        ai_researched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', review_id);

    if (updateError) {
      console.error('Failed to save research results:', updateError);
      await supabase
        .from('paid_compliance_reviews')
        .update({
          ai_research_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', review_id);

      return new Response(
        JSON.stringify({ error: 'Failed to save research results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Research results saved for review ${review_id}`);

    // 8. Fire Make.com webhook if configured
    const webhookUrl = Deno.env.get('MAKECOM_WEBHOOK_AI_RESEARCH_COMPLETE');
    if (webhookUrl) {
      try {
        const webhookPayload = {
          event: 'ai_research_complete',
          review_id: review.id,
          customer_email: review.customer_email,
          customer_name: review.customer_name,
          areas_researched: successCount,
          areas_failed: failCount,
          escalation_flags_count: (review.escalation_flags || []).length,
          ambiguity_score: review.ambiguity_score || 0,
          ai_draft_report: draftReport,
          timestamp: new Date().toISOString(),
        };

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });
        console.log('AI research webhook sent to Make.com');
      } catch (webhookError) {
        console.error('AI research webhook error (non-blocking):', webhookError);
      }
    } else {
      console.log('No MAKECOM_WEBHOOK_AI_RESEARCH_COMPLETE configured, skipping webhook');
    }

    return new Response(
      JSON.stringify({
        success: true,
        review_id,
        areas_researched: successCount,
        areas_failed: failCount,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error(`Research error: ${error.message}`);

    // Try to mark as failed if we have a review_id
    try {
      const body = await req.clone().json().catch(() => ({}));
      if (body.review_id) {
        await supabase
          .from('paid_compliance_reviews')
          .update({
            ai_research_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', body.review_id);
      }
    } catch (_) {
      // Ignore secondary error
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
