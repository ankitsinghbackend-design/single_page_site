'use client';

import React from 'react';
import { Play, Trash2, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useDeleteMedia } from '@/hooks/useMedia';

interface MediaCardProps {
  media: any;
  isSelected?: boolean;
  onSelect?: (media: any) => void;
  onDeleteSuccess?: () => void;
}

export function MediaCard({ media, isSelected, onSelect, onDeleteSuccess }: MediaCardProps) {
  const { mutate: deleteMedia, isPending: isDeleting } = useDeleteMedia();
  
  const isVideo = media.resourceType === 'video';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMedia(media.id, {
      onSuccess: () => {
        if (onDeleteSuccess) onDeleteSuccess();
      }
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-white cursor-pointer transition-all hover:shadow-md",
        isSelected ? "ring-2 ring-primary ring-offset-2 border-primary" : "border-neutral-200"
      )}
      onClick={() => onSelect && onSelect(media)}
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video w-full bg-neutral-100 overflow-hidden">
        <img 
          src={media.url} 
          alt={media.altText || media.publicId} 
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Video Overlay */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="rounded-full bg-white/90 p-2 shadow-sm">
              <Play className="h-6 w-6 text-neutral-900 ml-1" />
            </div>
          </div>
        )}

        {/* Selected Checkmark */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-white rounded-full">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
        )}

        {/* Format Badge */}
        <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white uppercase backdrop-blur-sm">
          {media.format}
        </div>
      </div>

      {/* Details Area */}
      <div className="flex flex-1 flex-col p-3">
        <p className="text-sm font-medium text-neutral-900 truncate" title={media.publicId}>
          {media.publicId.split('/').pop()}
        </p>
        <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
          <span>{formatBytes(media.bytes)}</span>
          <span>
            {isVideo && media.duration 
              ? `${Math.round(media.duration)}s` 
              : `${media.width}x${media.height}`
            }
          </span>
        </div>
      </div>

      {/* Actions Overlay */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className="rounded-md bg-white/90 p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600 shadow-sm transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Media</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this media? This action cannot be undone and may break any pages currently using this file.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}