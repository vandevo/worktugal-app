import { z } from 'zod';

export const businessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  instagram: z.string().optional(),
  contact_name: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(9, 'Please enter a valid phone number'),
  category: z.string().min(1, 'Please select a category'),
});

export const perkSchema = z.object({
  title: z.string().min(5, 'Perk title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  redemption_method: z.string().min(1, 'Please select a redemption method'),
  redemption_details: z.string().min(10, 'Please provide redemption details'),
  images: z.array(z.string()).optional(),
  logo: z.string().optional(),
  is_portuguese_owned: z.boolean(),
  needs_nif: z.boolean(),
});

export type BusinessFormData = z.infer<typeof businessSchema>;
export type PerkFormData = z.infer<typeof perkSchema>;