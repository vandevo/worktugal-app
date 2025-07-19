import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { uploadFile, validateImageFile } from '../../lib/storage';
import { Button } from './Button';
import { Alert } from './Alert';

interface FileUploadProps {
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  folder?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  hint,
  error,
  value,
  onChange,
  onClear,
  accept = 'image/*',
  className,
  folder = 'perk-images',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    
    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploading(true);
    
    try {
      const result = await uploadFile(file, 'perk-assets', folder);
      onChange(result.url);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadError(null);
    onClear?.();
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {uploadError && (
        <Alert variant="error" className="mb-4" onClose={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
              <img
                src={value}
                alt="Upload preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClear}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer hover:border-blue-500 hover:bg-gray-800/50',
              dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-800/30',
              uploading && 'cursor-not-allowed',
              error && 'border-red-500'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
              disabled={uploading}
            />

            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="h-8 w-8 text-blue-400 mx-auto animate-spin" />
                <p className="text-sm text-gray-300">Uploading image...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  {dragOver ? (
                    <Upload className="h-8 w-8 text-blue-400" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">
                    Drop an image here, or{' '}
                    <span className="text-blue-400 font-medium">click to browse</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, or WebP up to 5MB
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {hint && !error && !uploadError && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};