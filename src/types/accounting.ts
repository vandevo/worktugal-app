export type ServiceType = 'triage' | 'start_pack' | 'annual_return' | 'add_on';

export type ConsultStatus = 'requested' | 'paid' | 'scheduled' | 'delivered';

export interface ConsultBooking {
  id: number;
  user_id: string;
  service_type: ServiceType;
  preferred_date?: string;
  full_name: string;
  email: string;
  phone?: string;
  notes?: string;
  status: ConsultStatus;
  outcome_url?: string;
  stripe_session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultService {
  id: ServiceType;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  stripePriceId?: string;
}

export const CONSULT_SERVICES: ConsultService[] = [
  {
    id: 'triage',
    name: 'Tax Triage Consult',
    price: 59,
    duration: '30 minutes',
    description: 'Quick clarity on your immediate tax question. Written outcome note delivered within 48h.',
    features: [
      '30-minute video or phone call',
      'Written outcome note',
      'Delivered within 48 hours',
      'Activity code guidance',
      'VAT decision clarity',
      'Next steps checklist'
    ]
  },
  {
    id: 'start_pack',
    name: 'Freelancer Start Pack',
    price: 349,
    duration: '90 minutes',
    description: 'Complete setup for freelancers in Portugal. Activity opening, VAT decision, and eFatura configuration.',
    features: [
      'Activity opening guidance',
      'VAT regime decision support',
      'eFatura setup walkthrough',
      'Quarterly filing calendar',
      'Written setup report',
      '60 days email support',
      'Tax optimization recommendations'
    ]
  },
  {
    id: 'annual_return',
    name: 'Annual Return Consult',
    price: 149,
    duration: '60 minutes',
    description: 'Review your annual tax situation. Get credit toward filing if you book with us.',
    features: [
      'Annual return review',
      'Deduction optimization',
      'Filing deadline guidance',
      '€149 credit toward filing',
      'Written recommendations',
      'IRS Form 3 overview',
      'Social security guidance'
    ]
  }
];
