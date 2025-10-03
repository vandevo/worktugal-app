/**
 * Accounting Desk types and configurations
 * Defines consultation services, booking states, and business logic
 */

// Service type must match database enum values
export type ServiceType = 'tax_triage' | 'annual_return' | 'freelancer_start';

// Consult booking status lifecycle
export type ConsultStatus =
  | 'pending'                  // Initial state after form submission
  | 'pending_payment'          // Awaiting payment
  | 'completed_payment'        // Payment received, awaiting assignment
  | 'pending_assignment'       // Admin needs to assign accountant
  | 'scheduled'                // Accountant assigned, appointment booked
  | 'completed'                // Consultation finished
  | 'cancelled';               // Booking cancelled

// Consult booking database record
export interface ConsultBooking {
  id: number;
  user_id: string;
  service_type: ServiceType;
  full_name: string;
  email: string;
  phone?: string;
  preferred_date?: string;
  notes?: string;
  intake_current_status?: string;
  intake_main_question?: string;
  intake_urgency?: string;
  intake_documents?: string[];
  status: ConsultStatus;
  stripe_payment_intent_id?: string;
  outcome_url?: string;
  created_at: string;
  updated_at: string;
}

// Service configurations for UI display
export const CONSULT_SERVICES = {
  tax_triage: {
    name: 'Tax Triage Consult',
    duration: '30 minutes',
    price: 59,
    description: '30-minute video consultation with an OCC-certified accountant. Get clarity on your immediate tax question with a written outcome note delivered within 48 hours.',
    features: [
      '30-minute live video consultation',
      'OCC-certified Portuguese accountant',
      'Written outcome note within 48 hours',
      'Immediate tax question clarity',
      'Email follow-up support'
    ],
    priceId: import.meta.env.VITE_STRIPE_PRICE_TRIAGE || 'price_1SDY1RBm1NepJXMzW2Yb7Ve6'
  },
  annual_return: {
    name: 'Annual Return Consult',
    duration: '60 minutes',
    price: 149,
    description: '60-minute annual tax situation review with deduction optimization and filing deadline guidance. Includes €149 credit toward filing if you book with us, written recommendations, IRS Form 3 overview, and social security guidance.',
    features: [
      '60-minute comprehensive tax review',
      'Deduction optimization strategies',
      '€149 credit toward tax filing service',
      'Written recommendations report',
      'IRS Form 3 walkthrough',
      'Social security guidance',
      'Filing deadline checklist'
    ],
    priceId: import.meta.env.VITE_STRIPE_PRICE_ANNUAL_RETURN || 'price_1SDYZRBm1NepJXMzyS81QIE7'
  },
  freelancer_start: {
    name: 'Freelancer Start Pack',
    duration: '90 minutes',
    price: 349,
    description: 'Complete freelancer setup in Portugal. 90-minute consultation covering activity opening, VAT regime decision, eFatura configuration, and 60 days of email support.',
    features: [
      '90-minute setup consultation',
      'Activity opening (Abertura de Atividade) guidance',
      'VAT regime selection advice',
      'eFatura system configuration',
      'Portuguese tax system overview',
      'Quarterly obligations timeline',
      '60 days email support included',
      'Startup checklist & resources'
    ],
    priceId: import.meta.env.VITE_STRIPE_PRICE_START_PACK || 'price_1SDY5VBm1NepJXMzFOO40FhI'
  }
} as const;

// Helper to get service details by type
export function getServiceDetails(serviceType: ServiceType) {
  return CONSULT_SERVICES[serviceType];
}

// Format service type for display
export function formatServiceType(serviceType: ServiceType): string {
  return CONSULT_SERVICES[serviceType]?.name || serviceType;
}

// Status display configurations
export const STATUS_COLORS: Record<ConsultStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  pending_payment: 'bg-orange-500/20 text-orange-300',
  completed_payment: 'bg-blue-500/20 text-blue-300',
  pending_assignment: 'bg-purple-500/20 text-purple-300',
  scheduled: 'bg-green-500/20 text-green-300',
  completed: 'bg-gray-500/20 text-gray-300',
  cancelled: 'bg-red-500/20 text-red-300'
};

export const STATUS_LABELS: Record<ConsultStatus, string> = {
  pending: 'Pending',
  pending_payment: 'Awaiting Payment',
  completed_payment: 'Payment Complete',
  pending_assignment: 'Being Assigned',
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled'
};
