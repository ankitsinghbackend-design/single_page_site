'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetMedia } from '@/hooks/useMedia';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaUploader } from '@/components/media/MediaUploader';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SiteMediaPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { data: mediaItems, isLoading, refetch } = useGetMedia(siteId);

  const handleUploadSuccess = () => {
    setIsUploadOpen(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Media Library</h1>
          <p className="mt-2 text-sm text-neutral-500">Manage all images and videos for this site.</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Upload New Media</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <MediaUploader siteId={siteId} onUpload={handleUploadSuccess} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-white shadow-sm min-h-[500px] p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full py-32">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        ) : mediaItems?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-32 text-center text-neutral-500">
            <ImageIcon className="h-16 w-16 mb-4 text-neutral-200" />
            <h3 className="text-lg font-medium text-neutral-900">No media uploaded yet</h3>
            <p className="mt-1 max-w-sm">Upload images and videos here to use them across your landing pages and product pages.</p>
            <Button className="mt-6" onClick={() => setIsUploadOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Upload your first file
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mediaItems?.map((item: any) => (
              <MediaCard 
                key={item.id} 
                media={item} 
                onDeleteSuccess={() => refetch()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}