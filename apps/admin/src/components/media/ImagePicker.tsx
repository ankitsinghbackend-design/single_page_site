'use client';

import React, { useState } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaLibrary } from './MediaLibrary';
import { cn } from '@/lib/utils';

interface ImagePickerProps {
  value?: string; // publicId or URL
  onChange: (value: string) => void;
  siteId?: string;
  className?: string;
}

export function ImagePicker({ value, onChange, siteId, className }: ImagePickerProps) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Derive display URL. If it's a full URL, use it. Otherwise construct Cloudinary URL.
  const displayUrl = React.useMemo(() => {
    if (!value) return null;
    if (value.startsWith('http')) return value;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
    return \`https://res.cloudinary.com/\${cloudName}/image/upload/\${value}\`;
  }, [value]);

  const handleSelect = (media: any) => {
    // We typically store publicId to let the frontend/backend handle transformations,
    // but sometimes storing the URL is easier depending on the schema.
    // The schemas use \`imagePublicId: z.string()\`, so we store the publicId.
    onChange(media.publicId);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {value ? (
        <div className="relative group rounded-lg border border-neutral-200 overflow-hidden inline-block max-w-sm w-full bg-neutral-50 aspect-video">
          <img 
            src={displayUrl!} 
            alt="Selected image" 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={() => setIsLibraryOpen(true)}
            >
              Change
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              onClick={() => onChange("")}
            >
              Remove
            </Button>
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded truncate max-w-full backdrop-blur-sm">
              {value}
            </span>
          </div>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-neutral-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors max-w-sm w-full aspect-video"
          onClick={() => setIsLibraryOpen(true)}
        >
          <ImageIcon className="h-10 w-10 text-neutral-400 mb-3" />
          <p className="text-sm font-medium text-neutral-900">No image selected</p>
          <p className="text-xs text-neutral-500 mt-1">Click to browse media library</p>
        </div>
      )}

      <MediaLibrary
        open={isLibraryOpen}
        onOpenChange={setIsLibraryOpen}
        siteId={siteId}
        accept="images"
        onSelect={handleSelect}
      />
    </div>
  );
}