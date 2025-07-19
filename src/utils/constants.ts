export const BUSINESS_CATEGORIES = [
  'Cafés & Restaurants',
  'Coworking & Studios',
  'Gyms & Wellness',
  'Events & Social Spaces',
  'Experts & Services',
  'Travel & Experiences'
];

export const REDEMPTION_METHODS = [
  { value: 'verbal', label: 'Verbal mention ("I have Worktugal Pass")' },
  { value: 'qr', label: 'QR Code scan' },
  { value: 'promo_code', label: 'Promo code' },
  { value: 'other', label: 'Other method' }
];

export const LISTING_PRICE = 49; // €49 listing fee

// Location constants - Grouped neighborhoods for better UX
export const LISBON_NEIGHBORHOOD_GROUPS = [
  {
    label: 'Central Lisbon',
    options: [
      { value: 'Chiado', label: 'Chiado' },
      { value: 'Príncipe Real', label: 'Príncipe Real' },
      { value: 'Baixa / Rossio', label: 'Baixa / Rossio' },
      { value: 'Cais do Sodré', label: 'Cais do Sodré' },
      { value: 'Bairro Alto', label: 'Bairro Alto' },
      { value: 'Avenida da Liberdade', label: 'Avenida da Liberdade' },
    ]
  },
  {
    label: 'West Lisbon',
    options: [
      { value: 'Campo de Ourique', label: 'Campo de Ourique' },
      { value: 'Estrela / Lapa', label: 'Estrela / Lapa' },
      { value: 'Alcântara', label: 'Alcântara' },
      { value: 'Belém / Ajuda', label: 'Belém / Ajuda' },
      { value: 'Amoreiras / Campolide', label: 'Amoreiras / Campolide' },
    ]
  },
  {
    label: 'North & Business Districts',
    options: [
      { value: 'Avenidas Novas', label: 'Avenidas Novas' },
      { value: 'Saldanha / Picoas', label: 'Saldanha / Picoas' },
      { value: 'Marquês de Pombal', label: 'Marquês de Pombal' },
      { value: 'Lumiar / Telheiras', label: 'Lumiar / Telheiras' },
    ]
  },
  {
    label: 'East & Creative Zones',
    options: [
      { value: 'Intendente / Anjos / Arroios', label: 'Intendente / Anjos / Arroios' },
      { value: 'Beato / Marvila', label: 'Beato / Marvila' },
      { value: 'Parque das Nações', label: 'Parque das Nações' },
    ]
  },
  {
    label: 'Other',
    options: [
      { value: 'Other / Not Listed', label: 'Other / Not Listed' },
    ]
  }
];

// Future-ready city structure
export const CURRENT_CITY = 'Lisbon';
export const CURRENT_COUNTRY = 'Portugal';