import type { DiagnosticQuestion, DiagnosticAnswers } from './types';

export const DIAGNOSTIC_VERSION = '2.0';

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 'visa_status',
    text: 'What is your current visa/residency status in Portugal?',
    description: 'Your legal right to stay in Portugal',
    type: 'select',
    options: [
      { value: 'eu_citizen', label: 'EU Citizen (no visa needed)' },
      { value: 'd1_visa', label: 'D1 Work Visa' },
      { value: 'd7_visa', label: 'D7 Visa & Temporary Residence (passive income)' },
      { value: 'd2_visa', label: 'D2 Visa (entrepreneur/self-employed)' },
      { value: 'd8_visa', label: 'D8 Visa (Digital Nomad)' },
      { value: 'golden_visa', label: 'Golden Visa' },
      { value: 'family_reunion', label: 'Family Reunion Visa' },
      { value: 'hqa_tech', label: 'Highly Qualified Professional (HQA) / Tech Visa' },
      { value: 'temp_residence', label: 'Temporary Residency (e.g. CPLP, reunification, HQA)' },
      { value: 'temporary_protection', label: 'Temporary Protection (for refugees)' },
      { value: 'permanent', label: 'Permanent Residence or Long-Term Status' },
      { value: 'eu_family_member', label: 'Non-EU family member of Portuguese or EU citizen' },
      { value: 'tourist', label: 'Tourist Visa / Visa-free stay' },
      { value: 'none', label: 'No visa/permit (overstayed)' },
    ],
    weight: 20,
  },
  {
    id: 'tax_residence',
    text: 'Have you registered as a tax resident in Portugal?',
    description: 'Tax residency is usually automatic after 183 days in Portugal',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: "I'm not sure how to check this" },
    ],
    weight: 15,
  },
  {
    id: 'nif',
    text: 'Do you have a Portuguese tax number (NIF)?',
    description: 'Required for most financial activities in Portugal',
    type: 'yes-no',
    weight: 10,
  },
  {
    id: 'business_structure',
    text: 'What is your current business/employment structure?',
    type: 'select',
    options: [
      { value: 'employed_pt', label: 'Employed by Portuguese company' },
      { value: 'employed_foreign', label: 'Employed by foreign company' },
      { value: 'freelancer_remote', label: 'Working as a freelancer remotely' },
      { value: 'foreign_company', label: 'Running my own foreign company' },
      { value: 'freelancer', label: 'Trabalhador Independente (freelancer who issues Recibos Verdes)' },
      { value: 'unipessoal', label: 'Portuguese company (Unipessoal Lda)' },
      { value: 'passive_income', label: 'Passive income (investments, pensions, etc.)' },
      { value: 'none', label: 'No formal structure yet' },
    ],
    weight: 15,
  },
  {
    id: 'social_security',
    text: 'Are you registered with Portuguese Social Security (NISS)?',
    description: 'Required for legal work and contributions in Portugal',
    type: 'yes-no',
    weight: 10,
  },
  {
    id: 'banking',
    text: 'Do you have a Portuguese bank account?',
    type: 'yes-no',
    weight: 5,
  },
  {
    id: 'time_in_portugal',
    text: 'How much time do you intend to spend in Portugal each year?',
    description: 'Important for determining tax residency obligations',
    type: 'select',
    options: [
      { value: 'less_than_90', label: 'Less than 90 days' },
      { value: '90_to_183', label: '90 to 183 days (up to 6 months)' },
      { value: 'more_than_183', label: 'More than 183 days (over 6 months)' },
      { value: 'full_time', label: 'Full-time resident' },
    ],
    weight: 10,
  },
  {
    id: 'aima_appointment',
    text: 'Have you scheduled your AIMA appointment yet?',
    description:
      "AIMA (Agência para a Integração, Migrações e Asilo, Portugal's immigration authority)",
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not sure what this is' },
    ],
    weight: 10,
    skipConditions: (answers: DiagnosticAnswers) => {
      return ['eu_citizen', 'golden_visa', 'permanent', 'eu_family_member'].includes(
        answers.visa_status
      );
    },
  },
  {
    id: 'time_lived_in_portugal',
    text: 'How long have you been living in Portugal?',
    description: 'Important for tax residency and immigration status',
    type: 'select',
    options: [
      { value: 'less_than_90', label: 'Less than 90 days' },
      { value: '90_to_183', label: '90 to 183 days (up to 6 months)' },
      { value: 'more_than_183', label: 'More than 183 days (over 6 months)' },
      { value: 'not_yet', label: "I don't live there yet" },
    ],
    weight: 5,
  },
  {
    id: 'health_insurance',
    text: 'Do you have valid health insurance covering €30,000+ in medical costs?',
    description: 'Required for Schengen area compliance and visa applications',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes (meets Schengen requirements)' },
      { value: 'no', label: 'No (high rejection risk)' },
    ],
    weight: 15,
    skipConditions: (answers: DiagnosticAnswers) => {
      return ['eu_citizen', 'golden_visa', 'permanent', 'eu_family_member'].includes(
        answers.visa_status
      );
    },
  },
  {
    id: 'monthly_income',
    text: 'What is your average monthly income?',
    description:
      "Important for visa requirements and tax obligations. Portugal's legal minimum wage is €1,020/month (mainland) as of January 2026 (Portaria 35/2026). D8 Digital Nomad visa requires at least 4× minimum wage (€4,080/month).",
    type: 'select',
    options: [
      { value: 'below_1020', label: 'Below €1,020' },
      { value: '1020_to_4079', label: '€1,020 to €4,079' },
      { value: '4080_plus', label: '€4,080 or more' },
    ],
    weight: 10,
  },
  {
    id: 'overstay_risk',
    text: 'Have you stayed in Portugal over 90 days without a valid visa or residence permit?',
    description: 'Overstaying can result in fines, deportation, and future visa bans',
    type: 'select',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
      { value: 'not_sure', label: 'Not sure' },
    ],
    weight: 20,
  },
  {
    id: 'foreign_tax_deregistration',
    text: 'Have you formally deregistered as a tax resident in your previous country?',
    description:
      'If you moved to Portugal but never notified your previous country\'s tax authority, you may still be considered a tax resident there — creating dual taxation on worldwide income.',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes, I deregistered' },
      { value: 'no', label: 'No, I haven\'t' },
      { value: 'unsure', label: 'I\'m not sure' },
      { value: 'not_applicable', label: 'Not applicable (EU citizen, no prior residency)' },
    ],
    weight: 10,
  },
];

export function getActiveQuestions(answers: DiagnosticAnswers): DiagnosticQuestion[] {
  return diagnosticQuestions.filter(
    (q) => !q.skipConditions || !q.skipConditions(answers)
  );
}
