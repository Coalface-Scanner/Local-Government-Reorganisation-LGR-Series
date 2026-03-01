import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  bucket?: string;
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onError,
  bucket = 'article-images',
  label = 'Featured Image',
  maxSizeMB = 5
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      const errorMsg = `Image size must be less than ${maxSizeMB}MB`;
      if (onError) {
        onError(errorMsg);
      }
      return;
    }

    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select an image file';
      if (onError) {
        onError(errorMsg);
      }
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    try {
      setUploading(true);
      setUploadProgress(0);
      if (onError) onError('');

      // Simulate progress (Supabase doesn't provide real progress events)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
      setTimeout(() => setUploadProgress(0), 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image. Please try again.';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {label}
      </label>
      
      {/* URL Input */}
      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm"
        placeholder="https://example.com/image.jpg"
        aria-label={`${label} URL`}
      />
      
      <div className="text-center text-sm text-neutral-500">or</div>
      
      {/* Drag and Drop Area */}
      <label
        htmlFor={`image-upload-${label.toLowerCase().replace(/\s+/g, '-')}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`block border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-teal-500 bg-teal-50'
            : 'border-neutral-300 hover:border-neutral-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      >
        <input
          id={`image-upload-${label.toLowerCase().replace(/\s+/g, '-')}`}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
          aria-label={`Upload ${label.toLowerCase()}`}
        />
        
        {uploading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-teal-700">
              <Upload size={20} className="animate-pulse" aria-hidden="true" />
              <span className="font-medium">Uploading...</span>
            </div>
            {uploadProgress > 0 && (
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Upload progress: ${uploadProgress}%`}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <ImageIcon className="w-12 h-12 mx-auto text-neutral-400" aria-hidden="true" />
            <div className="text-sm text-neutral-600">
              <span className="font-medium text-teal-700">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-neutral-500">
              PNG, JPG, GIF up to {maxSizeMB}MB
            </div>
          </div>
        )}
      </label>
      
      {/* Preview */}
      {value && !uploading && (
        <div className="mt-4 relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-neutral-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Remove image"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
      
      <p className="text-xs text-neutral-500">
        Upload an image or enter a URL. Images are uploaded to Supabase storage (max {maxSizeMB}MB).
      </p>
    </div>
  );
}
