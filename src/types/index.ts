export interface Business {
  id: string;
  name: string;
  website?: string;
  instagram?: string;
  contact_name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  neighborhood?: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Perk {
  id: string;
  business_id: string;
  title: string;
  description: string;
  redemption_method: 'qr' | 'verbal' | 'promo_code' | 'other';
  redemption_details: string;
  images: string[];
  logo?: string;
  is_portuguese_owned: boolean;
  needs_nif: boolean;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  business?: Business;
}

export interface SubmissionData {
  business: Omit<Business, 'id' | 'created_at' | 'status'>;
  perk: Omit<Perk, 'id' | 'business_id' | 'created_at' | 'status' | 'business'>;
}

export interface PartnerSubmission {
  id: number;
  user_id: string;
  business_name: string;
  business_website?: string;
  business_instagram?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  business_category: string;
  business_neighborhood: string;
  perk_title: string;
  perk_description: string;
  perk_redemption_method: string;
  perk_redemption_details: string;
  perk_images?: string[];
  perk_logo?: string;
  perk_is_portuguese_owned: boolean;
  perk_needs_nif: boolean;
  status: 'pending_payment' | 'completed_payment' | 'abandoned' | 'approved' | 'rejected';
  access_type: 'lifetime' | 'subscription';
  stripe_order_id?: number;
  created_at: string;
  updated_at: string;
}

export type FormStep = 'business' | 'perk' | 'payment' | 'success';

export interface FormData {
  business: {
    name: string;
    website: string;
    instagram: string;
    contact_name: string;
    email: string;
    phone: string;
    category: string;
  };
  perk: {
    title: string;
    description: string;
    redemption_method: string;
    redemption_details: string;
    images: string[];
    logo: string;
    is_portuguese_owned: boolean;
    needs_nif: boolean;
    customer_nif?: string;
  };
  submissionId?: number;
}