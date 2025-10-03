/**
 * Application-wide constants
 * Business categories, neighborhoods, and other static data
 */

// Business categories for the Perk Marketplace
export const BUSINESS_CATEGORIES = [
  'Restaurants & Cafés',
  'Bars & Nightlife',
  'Fitness & Wellness',
  'Coworking Spaces',
  'Education & Language Schools',
  'Health & Medical',
  'Beauty & Personal Care',
  'Transportation & Car Rental',
  'Accommodation',
  'Shopping & Retail',
  'Professional Services',
  'Arts & Entertainment',
  'Tours & Activities',
  'Real Estate Services',
  'Technology & Electronics',
  'Home & Living',
  'Sports & Recreation',
  'Food & Grocery',
  'Pet Services',
  'Other Services'
] as const;

// Lisbon neighborhoods grouped by area
export const LISBON_NEIGHBORHOOD_GROUPS = [
  {
    label: 'Central Lisbon',
    options: [
      'Baixa',
      'Chiado',
      'Bairro Alto',
      'Príncipe Real',
      'Avenida da Liberdade',
      'Marquês de Pombal',
      'Rato',
      'Estrela'
    ]
  },
  {
    label: 'Historic Districts',
    options: [
      'Alfama',
      'Mouraria',
      'Graça',
      'Castelo',
      'Madragoa',
      'Santos'
    ]
  },
  {
    label: 'Riverside & Waterfront',
    options: [
      'Cais do Sodré',
      'Alcântara',
      'Belém',
      'Santa Apolónia',
      'Parque das Nações',
      'Terreiro do Paço'
    ]
  },
  {
    label: 'Modern Lisbon',
    options: [
      'Avenidas Novas',
      'Campo de Ourique',
      'Saldanha',
      'Areeiro',
      'Alvalade',
      'Lumiar',
      'Telheiras'
    ]
  },
  {
    label: 'East Lisbon',
    options: [
      'Marvila',
      'Beato',
      'Braço de Prata',
      'Xabregas',
      'Chelas',
      'Olivais'
    ]
  },
  {
    label: 'West & North',
    options: [
      'Benfica',
      'Carnide',
      'Ajuda',
      'Restelo',
      'Monsanto'
    ]
  },
  {
    label: 'Greater Lisbon Area',
    options: [
      'Cascais',
      'Estoril',
      'Oeiras',
      'Sintra',
      'Almada',
      'Costa da Caparica',
      'Setúbal',
      'Other'
    ]
  }
] as const;

// Flatten neighborhoods for simple dropdown use
export const LISBON_NEIGHBORHOODS = LISBON_NEIGHBORHOOD_GROUPS.flatMap(
  group => group.options
);

// Phone country code for Portugal
export const PORTUGAL_COUNTRY_CODE = '+351';

// Currency
export const DEFAULT_CURRENCY = 'EUR';
export const CURRENCY_SYMBOL = '€';

// Platform fees
export const PLATFORM_FEE_PERCENTAGE = 0.30; // 30% platform fee on consultations
export const ACCOUNTANT_PAYOUT_PERCENTAGE = 0.70; // 70% goes to accountant

// Validation constants
export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// Contact information
export const PLATFORM_EMAIL = 'hello@worktugal.com';
export const SUPPORT_EMAIL = 'support@worktugal.com';

// Social media
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/worktugal',
  linkedin: 'https://linkedin.com/company/worktugal',
  twitter: 'https://twitter.com/worktugal'
} as const;

// Perk redemption methods
export const REDEMPTION_METHODS = [
  { value: 'qr', label: 'QR Code' },
  { value: 'verbal', label: 'Verbal Code' },
  { value: 'promo_code', label: 'Promo Code' },
  { value: 'other', label: 'Other Method' }
] as const;

// Partner listing price (lifetime early access offer)
export const LISTING_PRICE = 49; // €49 one-time payment for lifetime listing
