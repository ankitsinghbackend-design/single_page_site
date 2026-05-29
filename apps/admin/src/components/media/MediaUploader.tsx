'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface MediaUploaderProps {
  siteId?: string;
  accept?: 'images' | 'videos' | 'all';
  onUpload?: (mediaRecord: any) => void;
}

export function MediaUploader({ siteId, accept = 'all', onUpload }: MediaUploaderProps) {
  const [uploads, setUploads] = useState<{ id: string; file: File; progress: number; status: 'uploading' | 'success' | 'error'; result?: any }[]>([]);

  const acceptConfig = {
    'images': { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/gif': [] },
    'videos': { 'video/mp4': [], 'video/quicktime': [], 'video/webm': [] },
    'all': {
      'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/gif': [],
      'video/mp4': [], 'video/quicktime': [], 'video/webm': []
    }
  };

  const maxSize = accept === 'videos' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB video, 10MB image

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const uploadId = Math.random().toString(36).substring(7);
      
      setUploads(prev => [...prev, { id: uploadId, file, progress: 0, status: 'uploading' }]);

      const formData = new FormData();
      formData.append('file', file);
      if (siteId) formData.append('siteId', siteId);

      apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, progress: percentCompleted } : u));
        }
      })
      .then((res) => {
        setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'success', result: res.data.data, progress: 100 } : u));
        if (onUpload) onUpload(res.data.data);
      })
      .catch((err) => {
        setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'error' } : u));
        console.error("Upload failed", err);
      });
    });
  }, [siteId, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig[accept],
    maxSize,
  });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-neutral-300 hover:border-primary hover:bg-neutral-50"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-10 w-10 text-neutral-400 mb-4" />
        <p className="text-sm text-neutral-600 font-medium">
          {isDragActive ? "Drop files here..." : "Drag & drop files here, or click to select files"}
        </p>
        <p className="text-xs text-neutral-500 mt-2">
          {accept === 'videos' ? 'MP4, MOV, WebM up to 100MB' : 
           accept === 'images' ? 'JPEG, PNG, WebP, GIF up to 10MB' : 
           'Images up to 10MB, Videos up to 100MB'}
        </p>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploads</h4>
          {uploads.map((upload) => (
            <div key={upload.id} className="flex items-center gap-4 p-3 border rounded-lg bg-white">
              <div className="flex-shrink-0">
                {upload.status === 'success' && upload.result?.format !== 'mp4' && upload.result?.format !== 'mov' ? (
                  <img src={upload.result?.url} alt="" className="w-10 h-10 object-cover rounded" />
                ) : (
                  <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-neutral-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-neutral-900 truncate">{upload.file.name}</p>
                  <span className="text-xs text-neutral-500">
                    {upload.status === 'success' ? '100%' : `${upload.progress}%`}
                  </span>
                </div>
                {upload.status === 'error' ? (
                  <p className="text-xs text-red-500">Upload failed</p>
                ) : (
                  <Progress value={upload.progress} className="h-1.5" />
                )}
              </div>
              <div>
                {upload.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {upload.status === 'error' && <X className="w-5 h-5 text-red-500" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}