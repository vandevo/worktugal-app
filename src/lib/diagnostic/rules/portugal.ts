import type { TrapRule } from '../types';

export const RULESET_VERSION = 'portugal_v5';

export const PortugalTrapRules: TrapRule[] = [
  {
    id: 'dual_tax_residency',
    conditions: {
      tax_residence: 'yes',
      foreign_tax_deregistration: ['no', 'unsure'],
    },
    exposureScore: 15,
    severity: 'high',
    fix: 'You are registered as a Portuguese tax resident but may still be considered a tax resident in your previous country. Formally deregister from your previous country\'s tax authority to avoid dual taxation on worldwide income.',
    legal_basis: 'CIRS Art. 16 — 183-day rule plus habitual abode test',
    source_url:
      'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs16.aspx',
    penalty_range: null,
    last_verified: '2026-03-12',
  },
  {
    id: 'dual_tax_residency_unregistered',
    conditions: {
      time_lived_in_portugal: 'more_than_183',
      foreign_tax_deregistration: ['no', 'unsure'],
    },
    exposureScore: 15,
    severity: 'high',
    fix: 'You have lived in Portugal over 183 days, which makes you a tax resident under Portuguese law (CIRS Art. 16) regardless of whether you have registered. If you have not formally deregistered from your previous country, you may face dual taxation on your worldwide income.',
    legal_basis: 'CIRS Art. 16 — 183-day presence triggers automatic tax residency',
    source_url:
      'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs16.aspx',
    penalty_range: null,
    last_verified: '2026-03-12',
  },
  {
    id: 'vat_misclassification',
    conditions: {
      business_structure: ['freelancer', 'unipessoal'],
      monthly_income: ['1020_to_4079', '4080_plus'],
    },
    exposureScore: 20,
    severity: 'high',
    fix: 'Review your VAT registration status. Freelancers and companies exceeding the annual threshold must register for IVA. Backdated penalties apply.',
    legal_basis: 'CIVA Art. 29 — VAT registration obligation above annual threshold',
    source_url:
      'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_rep/Pages/codigo-do-iva-indice.aspx',
    penalty_range: 'Backdated VAT plus penalties',
    last_verified: '2026-03-05',
  },
  {
    id: 'unfiled_irs',
    conditions: {
      time_lived_in_portugal: ['more_than_183'],
      business_structure: ['employed_foreign', 'freelancer_remote', 'foreign_company', 'passive_income'],
    },
    exposureScore: 20,
    severity: 'high',
    fix: 'You have lived in Portugal over 183 days and have foreign-source income. Under CIRS Art. 16 you are a tax resident by law and must file IRS Modelo 3 including Annex J to declare your foreign income and any overseas bank accounts. The filing window is April 1 to June 30 each year. Penalty for late or missing filing: 150 to 3,750 EUR.',
    legal_basis: 'CIRS Art. 16 + IRS Modelo 3, Annex J — foreign income declaration for tax residents with overseas income',
    source_url:
      'https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Rendimentos/Declaracao/Modelo_3/Paginas/default.aspx',
    penalty_range: '150–3,750 EUR for late filing',
    last_verified: '2026-03-19',
  },
  {
    id: 'permit_expiry_risk',
    conditions: {
      aima_appointment: 'yes',
      visa_status: ['d7_visa', 'd8_visa', 'd2_visa', 'd1_visa', 'family_reunion', 'hqa_tech', 'temp_residence', 'eu_family_member'],
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
    id: 'permit_no_aima',
    conditions: {
      aima_appointment: ['no', 'unsure'],
      visa_status: ['d7_visa', 'd8_visa', 'd2_visa', 'd1_visa', 'family_reunion', 'hqa_tech', 'temp_residence', 'eu_family_member'],
    },
    exposureScore: 20,
    severity: 'high',
    fix: 'Your visa type requires an AIMA appointment to convert to a residence permit. Without scheduling this, you may be staying illegally once your visa entry period expires. AIMA appointments must be booked through the official AIMA portal. Fines for illegal stay: 80 to 700 EUR under Law 23/2007 Art. 192.',
    legal_basis: 'Law 23/2007 Art. 192 — illegal stay; AIMA residence permit conversion requirement',
    source_url: 'https://files.dre.pt/StaticContent/Lei_23_2007_EN.pdf',
    penalty_range: '80–700 EUR',
    last_verified: '2026-03-12',
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
    id: 'eu_crue_missing',
    conditions: {
      visa_status: 'eu_citizen',
      time_lived_in_portugal: ['more_than_183', '90_to_183'],
      crue_registered: 'no',
    },
    exposureScore: 15,
    severity: 'high',
    fix: 'EU citizens who stay in Portugal for more than 3 months must obtain a Certificado de Registo de Cidadão da União Europeia (CRUE). You have 30 days after the 3-month mark to apply. Go to your local Câmara Municipal (city hall) — not AIMA, which handles non-EU nationals only. Bring your EU ID or passport, proof of address, and proof of employment, self-sufficiency, or study enrolment. Without CRUE you cannot register for NISS, and the two cannot be done in parallel. Fine for missing the deadline: €400 to €1,500 under Lei 37/2006.',
    legal_basis: 'Lei 37/2006 Art. 14 — EU citizen registration obligation after 3 months of residence; Art. 16 — administrative fine for non-registration',
    source_url: 'https://aima.gov.pt/pt/nacionais-ue-e-familiares/nacionais-ue/certificado-de-registo-para-nacionais-ue',
    penalty_range: '€400–€1,500',
    last_verified: '2026-03-27',
  },
  {
    id: 'eu_article7_no_status',
    conditions: {
      visa_status: 'eu_citizen',
      time_lived_in_portugal: ['90_to_183', 'more_than_183'],
      business_structure: 'none',
    },
    exposureScore: 15,
    severity: 'medium',
    fix: 'EU free movement after 3 months is not unconditional. Under Article 7 of Directive 2004/38, you must meet at least one condition: employed or self-employed in Portugal, have sufficient resources not to become a burden on the social assistance system, be enrolled as a student, or be a family member of someone who qualifies. With no formal structure and 90+ days in Portugal, your right to remain may be challenged. Establish employment, register as a freelancer, or ensure you have documented sufficient resources.',
    legal_basis: 'EU Directive 2004/38 Art. 7 — conditions for right of residence beyond 3 months',
    source_url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32004L0038',
    penalty_range: null,
    last_verified: '2026-03-27',
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
      'https://www2.gov.pt/pt/servicos/obter-informacoes-sobre-as-contribuicoes-para-a-seguranca-social-pagamento-de-trabalhador-independente',
    penalty_range: 'Arrears plus interest plus suspended benefits',
    last_verified: '2026-03-05',
  },
];
