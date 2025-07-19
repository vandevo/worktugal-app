import { z } from 'zod';

export const businessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  instagram: z.string().optional(),
  contact_name: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .transform((phone) => {
      // Remove spaces, dashes, and other formatting
      const cleaned = phone.replace(/[\s\-()]/g, '');
      
      // If starts with 9 and is 9 digits (Portuguese mobile), auto-prepend +351
      if (/^9\d{8}$/.test(cleaned)) {
        return `+351${cleaned}`;
      }
      
      return cleaned;
    })
    .refine((phone) => {
      // Should start with + and have at least 9 digits after it
      const match = phone.match(/^\+(\d{9,})$/);
      return match !== null;
    }, 'Please enter a valid phone number (e.g., +351 912 345 678 or 912 345 678)'),
  category: z.string().min(1, 'Please select a category'),
  neighborhood: z.string().min(1, 'Please select a neighborhood'),
});

export const perkSchema = z.object({
  title: z.string().min(5, 'Perk title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  redemption_method: z.string().min(1, 'Please select how customers will redeem this perk'),
  redemption_details: z.string().min(10, 'Please provide specific redemption details'),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  logo: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  is_portuguese_owned: z.boolean(),
  needs_nif: z.boolean(),
});

export type BusinessFormData = z.infer<typeof businessSchema>;
export type PerkFormData = z.infer<typeof perkSchema>;