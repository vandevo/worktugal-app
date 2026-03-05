import type {
  DiagnosticAnswers,
  DiagnosticResult,
  DiagnosticSegment,
  TrapRule,
  TriggeredTrap,
} from './types';
import { diagnosticQuestions } from './questions';
import { PortugalTrapRules, RULESET_VERSION } from './rules/portugal';

const TRAP_RULES_BY_COUNTRY: Record<string, TrapRule[]> = {
  portugal: PortugalTrapRules,
};

const RULESET_VERSIONS: Record<string, string> = {
  portugal: RULESET_VERSION,
};

export function getRulesetVersion(country: string): string {
  return RULESET_VERSIONS[country] ?? 'unknown';
}

/**
 * Setup Score — adapted directly from the original calculateScore in quizQuestions.md.
 * Measures structural compliance completeness (0–100).
 */
export function calculateSetupScore(answers: DiagnosticAnswers): number {
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (const question of diagnosticQuestions) {
    const shouldSkip = question.skipConditions?.(answers);
    if (shouldSkip) continue;

    maxPossibleScore += question.weight;
    const answer = answers[question.id];
    if (answer === undefined) continue;

    switch (question.id) {
      case 'visa_status': {
        const fullCredit = [
          'eu_citizen', 'd1_visa', 'd7_visa', 'd2_visa', 'd8_visa',
          'golden_visa', 'family_reunion', 'hqa_tech', 'temp_residence',
          'temporary_protection', 'permanent', 'eu_family_member',
        ];
        if (fullCredit.includes(answer)) {
          totalScore += question.weight;
        } else if (answer === 'tourist') {
          totalScore += question.weight * 0.3;
        }
        break;
      }
      case 'business_structure': {
        if (['employed_pt', 'freelancer', 'unipessoal'].includes(answer)) {
          totalScore += question.weight;
        } else if (['employed_foreign', 'foreign_company', 'freelancer_remote'].includes(answer)) {
          totalScore += question.weight * 0.5;
        } else if (answer === 'passive_income' && answers.visa_status === 'd7_visa') {
          totalScore += question.weight;
        }
        break;
      }
      case 'time_in_portugal': {
        if (answer === 'full_time') totalScore += question.weight;
        else if (answer === 'more_than_183') totalScore += question.weight * 0.8;
        else if (answer === '90_to_183') totalScore += question.weight * 0.4;
        break;
      }
      case 'tax_residence': {
        if (answer === 'yes') totalScore += question.weight;
        else if (answer === 'unsure') totalScore += question.weight * 0.3;
        break;
      }
      case 'aima_appointment': {
        if (answer === 'yes') totalScore += question.weight;
        else if (answer === 'unsure') totalScore += question.weight * 0.3;
        break;
      }
      case 'monthly_income': {
        if (answer === '3480_plus') totalScore += question.weight;
        else if (answer === '870_to_3479') totalScore += question.weight * 0.8;
        else if (answer === 'below_870') totalScore += question.weight * 0.5;
        break;
      }
      case 'overstay_risk': {
        if (answer === 'no') totalScore += question.weight;
        else if (answer === 'not_sure') totalScore += question.weight * 0.3;
        break;
      }
      default: {
        if (question.type === 'yes-no' && answer === 'yes') {
          totalScore += question.weight;
        } else if (question.type === 'select' && answer === 'yes') {
          totalScore += question.weight;
        }
        break;
      }
    }
  }

  return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
}

/**
 * Evaluates whether a single trap rule's conditions are met by the user's answers.
 * Conditions use AND logic between fields.
 * Array values for a single field use OR logic (answer must match any value in the array).
 */
function evaluateTrapConditions(
  rule: TrapRule,
  answers: DiagnosticAnswers
): boolean {
  for (const [field, expected] of Object.entries(rule.conditions)) {
    const answer = answers[field];
    if (answer === undefined) return false;

    if (Array.isArray(expected)) {
      if (!expected.includes(answer)) return false;
    } else {
      if (answer !== expected) return false;
    }
  }
  return true;
}

/**
 * Returns all traps triggered by the user's answers for a given country.
 */
export function getTriggeredTraps(
  answers: DiagnosticAnswers,
  country: string = 'portugal'
): TriggeredTrap[] {
  const rules = TRAP_RULES_BY_COUNTRY[country] ?? [];
  const triggered: TriggeredTrap[] = [];

  for (const rule of rules) {
    if (evaluateTrapConditions(rule, answers)) {
      triggered.push({
        id: rule.id,
        severity: rule.severity,
        fix: rule.fix,
        legal_basis: rule.legal_basis,
        source_url: rule.source_url,
        penalty_range: rule.penalty_range,
        exposureScore: rule.exposureScore,
      });
    }
  }

  return triggered;
}

/**
 * Exposure Index — sum of triggered trap scores, capped at 100.
 */
export function calculateExposureIndex(
  answers: DiagnosticAnswers,
  country: string = 'portugal'
): number {
  const traps = getTriggeredTraps(answers, country);
  const raw = traps.reduce((sum, t) => sum + t.exposureScore, 0);
  return Math.min(raw, 100);
}

/**
 * Classifies the user into one of 4 segments based on dual scores.
 * Setup threshold: 60 (below = low, at or above = high)
 * Exposure threshold: 30 (below = low, at or above = high)
 */
export function classifySegment(
  setupScore: number,
  exposureIndex: number
): DiagnosticSegment {
  const highSetup = setupScore >= 60;
  const highExposure = exposureIndex >= 30;

  if (highSetup && highExposure) return 'high_setup_high_exposure';
  if (highSetup && !highExposure) return 'high_setup_low_exposure';
  if (!highSetup && highExposure) return 'low_setup_high_exposure';
  return 'low_setup_low_exposure';
}

export const SEGMENT_MESSAGES: Record<DiagnosticSegment, string> = {
  low_setup_low_exposure:
    'You still need to complete several legal steps but currently face limited regulatory risk.',
  low_setup_high_exposure:
    'You have both missing setup steps and potential regulatory risks that require immediate attention.',
  high_setup_high_exposure:
    'Your setup appears complete but hidden compliance risks were detected that could cost you.',
  high_setup_low_exposure:
    'Your compliance setup appears strong and your exposure risk is low.',
};

/**
 * Generates setup-based recommendations (adapted from original getRecommendations).
 */
export function getRecommendations(answers: DiagnosticAnswers): string[] {
  const recs: string[] = [];

  if (!answers.visa_status || answers.visa_status === 'tourist' || answers.visa_status === 'none') {
    recs.push('Apply for an appropriate residency visa based on your situation (D1, D7, D2, or Digital Nomad)');
  }

  if (answers.visa_status === 'eu_family_member') {
    recs.push('Apply for a residence card through AIMA as a family member of an EU citizen under EU law');
  }

  if (
    (answers.tax_residence === 'no' || answers.tax_residence === 'unsure') &&
    (answers.time_in_portugal === 'more_than_183' || answers.time_in_portugal === 'full_time')
  ) {
    recs.push('Register as a tax resident with the Portuguese tax authorities');
  }

  if (answers.nif === 'no') {
    recs.push('Obtain a Portuguese tax number (NIF) as soon as possible');
  }

  if (answers.business_structure === 'none' || answers.business_structure === 'foreign_company') {
    recs.push('Establish a proper business structure in Portugal (Recibos Verdes or Unipessoal Lda)');
  }

  if (answers.social_security === 'no' && answers.business_structure !== 'employed_foreign') {
    recs.push('Register with Portuguese Social Security (NISS)');
  }

  if (answers.banking === 'no') {
    recs.push('Open a Portuguese bank account to facilitate local transactions and tax payments');
  }

  const aimaQ = diagnosticQuestions.find((q) => q.id === 'aima_appointment');
  const skipAima = aimaQ?.skipConditions?.(answers);
  if (!skipAima && (answers.aima_appointment === 'no' || answers.aima_appointment === 'unsure')) {
    recs.push('Schedule your AIMA appointment to formalize your residency status');
  }

  const healthQ = diagnosticQuestions.find((q) => q.id === 'health_insurance');
  const skipHealth = healthQ?.skipConditions?.(answers);
  if (!skipHealth && answers.health_insurance === 'no') {
    recs.push('Obtain health insurance covering at least €30,000 in medical costs');
  }

  if (answers.monthly_income === 'below_870') {
    recs.push('Ensure your income meets minimum requirements for your visa type (typically €870+ for D7/D8)');
  }

  if (answers.overstay_risk === 'yes' || answers.overstay_risk === 'not_sure') {
    recs.push('Address any potential overstay issues immediately to avoid legal complications');
  }

  return recs;
}

/**
 * Full diagnostic run: computes both scores, classifies segment, returns complete result.
 */
export function runDiagnostic(
  answers: DiagnosticAnswers,
  country: string = 'portugal'
): DiagnosticResult {
  const setupScore = calculateSetupScore(answers);
  const triggeredTraps = getTriggeredTraps(answers, country);
  const exposureIndex = Math.min(
    triggeredTraps.reduce((sum, t) => sum + t.exposureScore, 0),
    100
  );
  const segment = classifySegment(setupScore, exposureIndex);
  const recommendations = getRecommendations(answers);

  return {
    setupScore,
    exposureIndex,
    segment,
    triggeredTraps,
    recommendations,
  };
}
