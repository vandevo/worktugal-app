import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Loader2, Eye } from 'lucide-react';
import { cn } from '../../utils/cn';
import { uploadFile, validateDocumentFile } from '../../lib/storage';
import { Button } from './Button';
import { Alert } from './Alert';

interface DocumentUploadProps {
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  onChange: (url: string, path: string) => void;
  onClear?: () => void;
  className?: string;
  folder?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  hint,
  error,
  value,
  onChange,
  onClear,
  className,
  folder = 'resumes',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setUploadError(null);

    const validationError = validateDocumentFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const result = await uploadFile(file, 'accountant-resumes', folder);
      onChange(result.url, result.path);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload file');
      setFileName('');
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
    event?.preventDefault();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadError(null);
    setFileName('');
    onClear?.();
  };

  const handlePreview = () => {
    if (value) {
      window.open(value, '_blank');
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-300 mb-2">
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
            key="uploaded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700 p-4 group">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <FileText className="w-10 h-10 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {fileName || 'Resume uploaded'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Click the eye icon to preview
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePreview();
                    }}
                    className="w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                    aria-label="Preview document"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                    aria-label="Remove document"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
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
              'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer backdrop-blur-xl',
              dragOver
                ? 'border-blue-400 bg-blue-400/10 shadow-lg shadow-blue-500/20'
                : 'border-white/[0.12] bg-white/[0.02] hover:border-blue-400/60 hover:bg-white/[0.04] hover:shadow-lg',
              uploading && 'cursor-not-allowed',
              error && 'border-red-400'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              if (!uploading) {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleInputChange}
              className="hidden"
              disabled={uploading}
            />

            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="h-8 w-8 text-blue-400 mx-auto animate-spin" />
                <p className="text-sm text-gray-300">Uploading document...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  {dragOver ? (
                    <Upload className="h-8 w-8 text-blue-400" />
                  ) : (
                    <FileText className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">
                    Drop your resume here, or{' '}
                    <span className="text-blue-400 font-medium">click to browse</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    PDF, DOC, DOCX, or image up to 10MB
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
