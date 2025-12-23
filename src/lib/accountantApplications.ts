import { supabase } from './supabase';
import { uploadFile } from './storage';

interface AccountantApplicationData {
  full_name: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  occ_number: string | null;
  has_occ: boolean;
  experience_years: string;
  english_fluency: string;
  portuguese_fluency: string;
  specializations: string[];
  bio: string;
  availability: string;
  why_worktugal: string;
  resume_file: File | null;
  // Partnership fit fields
  current_freelancer_clients: string;
  foreign_client_percentage: string;
  preferred_communication: string;
  accepts_triage_role: string;
  vat_scenario_answer: string;
  partnership_interest_level: string;
}

export const submitAccountantApplication = async (data: AccountantApplicationData) => {
  try {
    let resumeUrl = null;
    let resumePath = null;

    if (data.resume_file) {
      const timestamp = Date.now();
      const sanitizedEmail = data.email.replace(/[^a-zA-Z0-9]/g, '_');
      const folder = `${sanitizedEmail}_${timestamp}`;

      const uploadResult = await uploadFile(data.resume_file, 'accountant-resumes', folder);

      resumePath = uploadResult.path;
      resumeUrl = uploadResult.url;
    }

    const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-accountant-application`;

    const payload = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      linkedin_url: data.linkedin_url,
      website_url: data.website_url,
      occ_number: data.occ_number,
      has_occ: data.has_occ,
      experience_years: data.experience_years,
      english_fluency: data.english_fluency,
      portuguese_fluency: data.portuguese_fluency,
      specializations: data.specializations,
      bio: data.bio,
      availability: data.availability,
      why_worktugal: data.why_worktugal,
      resume_url: resumeUrl,
      resume_path: resumePath,
      current_freelancer_clients: data.current_freelancer_clients,
      foreign_client_percentage: data.foreign_client_percentage,
      preferred_communication: data.preferred_communication,
      accepts_triage_role: data.accepts_triage_role,
      vat_scenario_answer: data.vat_scenario_answer,
      partnership_interest_level: data.partnership_interest_level,
    };

    console.log('Submitting accountant application via Edge Function...');
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Edge Function error:', result);
      throw new Error(result.error || 'Failed to submit application');
    }

    if (!result.success) {
      throw new Error(result.error || 'Failed to submit application');
    }

    console.log('Application submitted successfully:', result.data.id);
    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('Error in submitAccountantApplication:', err);
    return { data: null, error: err.message || 'Failed to submit application' };
  }
};
