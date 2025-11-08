/**
 * Tax Checkup Data Analysis Script
 *
 * Run this script periodically (e.g., monthly) to analyze real user data
 * and update the taxCheckupEnhancements.ts configuration file.
 *
 * Usage:
 *   node scripts/analyze-tax-checkup-data.js
 *
 * Requirements:
 *   - .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

config({ path: join(rootDir, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// DATA ANALYSIS FUNCTIONS
// ============================================================================

async function analyzeUserPatterns() {
  console.log('📊 Analyzing tax checkup user patterns...\n');

  // Get all submissions
  const { data: submissions, error } = await supabase
    .from('tax_checkup_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching data:', error.message);
    return null;
  }

  if (!submissions || submissions.length === 0) {
    console.log('⚠️  No submissions found in database');
    return null;
  }

  const total = submissions.length;
  console.log(`✅ Analyzing ${total} total submissions\n`);

  // Analyze work types
  const workTypes = {};
  submissions.forEach(s => {
    workTypes[s.work_type] = (workTypes[s.work_type] || 0) + 1;
  });
  const sortedWorkTypes = Object.entries(workTypes)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({
      type,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }));

  // Analyze income ranges
  const incomeRanges = {};
  submissions.forEach(s => {
    if (s.estimated_annual_income) {
      incomeRanges[s.estimated_annual_income] = (incomeRanges[s.estimated_annual_income] || 0) + 1;
    }
  });
  const sortedIncome = Object.entries(incomeRanges)
    .sort(([, a], [, b]) => b - a)
    .map(([range, count]) => ({
      range,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }));

  // Analyze residency status
  const residencyStatus = {};
  submissions.forEach(s => {
    if (s.residency_status) {
      residencyStatus[s.residency_status] = (residencyStatus[s.residency_status] || 0) + 1;
    }
  });
  const sortedResidency = Object.entries(residencyStatus)
    .sort(([, a], [, b]) => b - a)
    .map(([status, count]) => ({
      status,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }));

  // Calculate compliance metrics
  const avgMonths = submissions.reduce((sum, s) => sum + (s.months_in_portugal || 0), 0) / total;
  const avgRedFlags = submissions.reduce((sum, s) => sum + (s.compliance_score_red || 0), 0) / total;
  const avgYellowWarnings = submissions.reduce((sum, s) => sum + (s.compliance_score_yellow || 0), 0) / total;
  const avgGreenItems = submissions.reduce((sum, s) => sum + (s.compliance_score_green || 0), 0) / total;

  // Calculate missing items percentages
  const pctNoNIF = (submissions.filter(s => s.has_nif === false).length / total) * 100;
  const pctNoNISS = (submissions.filter(s => s.has_niss === false).length / total) * 100;
  const pctNoActivity = (submissions.filter(s => s.activity_opened === false).length / total) * 100;
  const pctNoVAT = (submissions.filter(s => s.has_vat_number === false).length / total) * 100;

  // Print analysis results
  console.log('📈 WORK TYPE DISTRIBUTION:');
  sortedWorkTypes.forEach(({ type, count, percentage }) => {
    console.log(`   ${type.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
  });

  console.log('\n💰 INCOME DISTRIBUTION:');
  sortedIncome.forEach(({ range, count, percentage }) => {
    console.log(`   ${range.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
  });

  console.log('\n🏠 RESIDENCY STATUS:');
  sortedResidency.forEach(({ status, count, percentage }) => {
    console.log(`   ${status.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
  });

  console.log('\n📊 COMPLIANCE METRICS:');
  console.log(`   Avg months in Portugal: ${avgMonths.toFixed(1)}`);
  console.log(`   Avg red flags:          ${avgRedFlags.toFixed(1)}`);
  console.log(`   Avg yellow warnings:    ${avgYellowWarnings.toFixed(1)}`);
  console.log(`   Avg green items:        ${avgGreenItems.toFixed(1)}`);

  console.log('\n⚠️  MISSING COMPLIANCE ITEMS:');
  console.log(`   No NIF:                 ${pctNoNIF.toFixed(1)}%`);
  console.log(`   No NISS:                ${pctNoNISS.toFixed(1)}%`);
  console.log(`   No activity opened:     ${pctNoActivity.toFixed(1)}%`);
  console.log(`   No VAT registration:    ${pctNoVAT.toFixed(1)}%`);

  return {
    totalSubmissions: total,
    workTypes: sortedWorkTypes,
    incomeRanges: sortedIncome,
    residencyStatus: sortedResidency,
    metrics: {
      avgMonths: parseFloat(avgMonths.toFixed(1)),
      avgRedFlags: parseFloat(avgRedFlags.toFixed(1)),
      avgYellowWarnings: parseFloat(avgYellowWarnings.toFixed(1)),
      avgGreenItems: parseFloat(avgGreenItems.toFixed(1)),
      pctNoNIF: parseFloat(pctNoNIF.toFixed(1)),
      pctNoNISS: parseFloat(pctNoNISS.toFixed(1)),
      pctNoActivity: parseFloat(pctNoActivity.toFixed(1)),
      pctNoVAT: parseFloat(pctNoVAT.toFixed(1))
    },
    lastAnalyzed: new Date().toISOString().split('T')[0]
  };
}

// ============================================================================
// CONFIGURATION GENERATOR
// ============================================================================

function generateEnhancementsConfig(analysis) {
  const workTypeOrder = analysis.workTypes.map(wt => wt.type);

  const template = `/**
 * Tax Checkup Enhancements - Data-Driven Configuration
 *
 * AUTO-GENERATED on ${analysis.lastAnalyzed}
 * Based on ${analysis.totalSubmissions} real user submissions
 *
 * To regenerate: npm run analyze-checkup-data
 */

export const USER_INSIGHTS = {
  lastAnalyzed: '${analysis.lastAnalyzed}',
  totalSubmissions: ${analysis.totalSubmissions},
  dataSource: 'tax_checkup_leads',

  patterns: {
    avgMonthsInPortugal: ${analysis.metrics.avgMonths},
    avgRedFlags: ${analysis.metrics.avgRedFlags},
    avgYellowWarnings: ${analysis.metrics.avgYellowWarnings},
    avgGreenItems: ${analysis.metrics.avgGreenItems},

    // Critical gaps identified
    missingNIF: ${analysis.metrics.pctNoNIF},
    missingNISS: ${analysis.metrics.pctNoNISS},
    noActivityOpened: ${analysis.metrics.pctNoActivity},
    noVATRegistration: ${analysis.metrics.pctNoVAT},
  },

  workTypes: {
${analysis.workTypes.map(wt => `    ${wt.type}: ${wt.percentage},`).join('\n')}
  },

  income: {
${analysis.incomeRanges.map(ir => `    '${ir.range}': ${ir.percentage},`).join('\n')}
  },

  residency: {
${analysis.residencyStatus.map(rs => `    ${rs.status}: ${rs.percentage},`).join('\n')}
  }
};

// Recommended work type order based on frequency
export const ENHANCED_WORK_TYPE_ORDER = [
${workTypeOrder.map(type => `  '${type}',`).join('\n')}
];

console.log('📊 Using data-driven insights from ${analysis.lastAnalyzed} (${analysis.totalSubmissions} users)');
`;

  return template;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 Tax Checkup Data Analysis\n');
  console.log('='.repeat(60) + '\n');

  const analysis = await analyzeUserPatterns();

  if (!analysis) {
    console.log('\n⚠️  Analysis incomplete - check errors above');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Analysis complete!\n');
  console.log('💡 RECOMMENDED ACTIONS:\n');
  console.log('1. Review the statistics above');
  console.log('2. Update src/utils/taxCheckupEnhancements.ts with new insights');
  console.log('3. Adjust red flag thresholds if needed');
  console.log('4. Update conditional helper text based on patterns\n');

  // Optionally generate config snippet
  console.log('📋 CONFIG SNIPPET (copy to taxCheckupEnhancements.ts):\n');
  const configSnippet = generateEnhancementsConfig(analysis);
  console.log(configSnippet);

  // Write to file for easy copying
  const outputPath = join(rootDir, 'tax-checkup-analysis.txt');
  writeFileSync(outputPath, configSnippet);
  console.log(`\n💾 Config snippet saved to: tax-checkup-analysis.txt\n`);
}

main().catch(console.error);
