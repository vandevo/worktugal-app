export interface Business {
  id: string;
  name: string;
  website?: string;
  instagram?: string;
  contact_name: string;
  email: string;
  phone: string;
  category: string;
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
  };
}