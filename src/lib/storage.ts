import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadFile = async (
  file: File,
  bucket: string = 'perk-assets',
  folder?: string
): Promise<UploadResult> => {
  // Generate unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
};

export const deleteFile = async (
  path: string,
  bucket: string = 'perk-assets'
): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

export const validateImageFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, or WebP)';
  }

  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }

  return null;
};

export const validateDocumentFile = (file: File): string | null => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a valid document (PDF, DOC, DOCX, or image)';
  }

  if (file.size > maxSize) {
    return 'File size must be less than 10MB';
  }

  return null;
};