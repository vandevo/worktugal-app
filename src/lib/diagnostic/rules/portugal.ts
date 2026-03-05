import type { TrapRule } from '../types';

export const RULESET_VERSION = 'portugal_v1';

export const PortugalTrapRules: TrapRule[] = [
  {
    id: 'dual_tax_residency',
    conditions: {
      tax_residence: 'yes',
      foreign_tax_deregistration: ['no', 'unsure'],
    },
    exposureScore: 15,
    severity: 'high',
    fix: 'Verify your tax residency status in your previous country. If you have not formally deregistered, you may face dual taxation on worldwide income.',
    legal_basis: 'CIRS Art. 16 — 183-day rule plus habitual abode test',
    source_url:
      'https://www.oecd.org/content/dam/oecd/en/topics/policy-issue-focus/aeoi/portugal-tax-residency.pdf',
    penalty_range: null,
    last_verified: '2026-03-05',
  },
  {
    id: 'vat_misclassification',
    conditions: {
      business_structure: ['freelancer', 'unipessoal'],
      monthly_income: ['870_to_3479', '3480_plus'],
    },
    exposureScore: 20,
    severity: 'high',
    fix: 'Review your VAT registration status. Freelancers and companies exceeding the annual threshold must register for IVA. Backdated penalties apply.',
    legal_basis: 'CIVA Art. 29 — VAT registration obligation above annual threshold',
    source_url:
      'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_702/Pages/default.aspx',
    penalty_range: 'Backdated VAT plus penalties',
    last_verified: '2026-03-05',
  },
  {
    id: 'unfiled_irs',
    conditions: {
      tax_residence: 'yes',
      time_lived_in_portugal: ['more_than_183'],
    },
    exposureScore: 20,
    severity: 'high',
    fix: 'File your IRS Modelo 3 including Annex J for foreign income and bank accounts. The filing window is April 1 to June 30.',
    legal_basis: 'IRS Modelo 3, Annex J — worldwide income declaration for residents',
    source_url:
      'https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/IRS_Modelo3_Instrucoes.pdf',
    penalty_range: '150–3,750 EUR for late filing',
    last_verified: '2026-03-05',
  },
  {
    id: 'permit_expiry_risk',
    conditions: {
      aima_appointment: 'yes',
      visa_status: ['d7_visa', 'd8_visa', 'd2_visa', 'd1_visa', 'family_reunion', 'hqa_tech', 'temp_residence'],
    },
    exposureScore: 15,
    severity: 'medium',
    fix: 'Track your residence permit expiration date. Late renewal carries fines of 75 to 300 EUR under Law 23/2007 Art. 201. File renewal at least 60 days before expiry.',
    legal_basis: 'Law 23/2007 Art. 201 — late renewal of temporary residence permit',
    source_url: 'https://files.dre.pt/StaticContent/Lei_23_2007_EN.pdf',
    penalty_range: '75–300 EUR',
    last_verified: '2026-03-05',
  },
  {
    id: 'schengen_overstay',
    conditions: {
      time_lived_in_portugal: ['less_than_90', '90_to_183'],
      overstay_risk: ['yes', 'not_sure'],
    },
    exposureScore: 10,
    severity: 'medium',
    fix: 'Calculate your Schengen 90/180 day stay using an official tracker. Overstaying results in fines of 80 to 700 EUR and potential future entry bans.',
    legal_basis: 'Law 23/2007 Art. 192 — illegal stay',
    source_url: 'https://files.dre.pt/StaticContent/Lei_23_2007_EN.pdf',
    penalty_range: '80–700 EUR',
    last_verified: '2026-03-05',
  },
  {
    id: 'social_security_misalignment',
    conditions: {
      business_structure: ['freelancer', 'freelancer_remote'],
      social_security: 'no',
    },
    exposureScore: 15,
    severity: 'high',
    fix: 'Register for NISS (Social Security Identification Number). Freelancers must pay contributions between the 10th and 20th of each month. Missing payments result in debt accrual and benefit suspension.',
    legal_basis: 'Código Contributivo — freelancer contribution obligations',
    source_url:
      'https://www2.gov.pt/en/servicos/obter-informacoes-sobre-as-contribuicoes-para-a-seguranca-social-pagamento-de-trabalhador-independente',
    penalty_range: 'Arrears plus interest plus suspended benefits',
    last_verified: '2026-03-05',
  },
];
