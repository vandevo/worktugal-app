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
  typical_hourly_rate: string | null;
  availability: string;
  why_worktugal: string;
  resume_file: File | null;
}

export const submitAccountantApplication = async (data: AccountantApplicationData) => {
  try {
    let resumeUrl = null;
    let resumePath = null;

    if (data.resume_file) {
      const timestamp = Date.now();
      const sanitizedEmail = data.email.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `accountant_resumes/${sanitizedEmail}_${timestamp}_${data.resume_file.name}`;

      const uploadResult = await uploadFile(data.resume_file, fileName, 'resumes');

      if (uploadResult.error) {
        throw new Error(`Failed to upload resume: ${uploadResult.error}`);
      }

      resumePath = uploadResult.data?.path || null;
      resumeUrl = uploadResult.data?.publicUrl || null;
    }

    const certifications = data.occ_number ? [
      {
        name: 'OCC',
        number: data.occ_number,
        expiry: null,
      }
    ] : [];

    const applicationPayload = {
      full_name: data.full_name,
      email: data.email.toLowerCase().trim(),
      phone: data.phone,
      linkedin_url: data.linkedin_url,
      website_url: data.website_url,
      bio: `${data.bio}\n\n---\nLanguages: English (${data.english_fluency}), Portuguese (${data.portuguese_fluency})\nAvailability: ${data.availability}\nTypical Rate: ${data.typical_hourly_rate ? `€${data.typical_hourly_rate}/hour` : 'Not specified'}\n\n---\nWhy Worktugal:\n${data.why_worktugal}`,
      experience_years: parseInt(data.experience_years.replace('+', '')) || 0,
      specializations: data.specializations,
      certifications: certifications,
      resume_url: resumeUrl,
      resume_path: resumePath,
      status: 'pending',
    };

    const { data: application, error } = await supabase
      .from('accountant_applications')
      .insert([applicationPayload])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      throw new Error(`Failed to submit application: ${error.message}`);
    }

    return { data: application, error: null };
  } catch (err: any) {
    console.error('Error in submitAccountantApplication:', err);
    return { data: null, error: err.message || 'Failed to submit application' };
  }
};
