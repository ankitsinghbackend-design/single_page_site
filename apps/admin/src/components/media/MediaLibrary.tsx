'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGetMedia } from '@/hooks/useMedia';
import { MediaCard } from './MediaCard';
import { MediaUploader } from './MediaUploader';
import { useDebounce } from '@/hooks/useDebounce'; // I will create this hook

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId?: string;
  accept?: 'images' | 'videos' | 'all';
  onSelect?: (media: any) => void;
}

export function MediaLibrary({ open, onOpenChange, siteId, accept = 'all', onSelect }: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos'>(accept);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);

  // We are using the standard useGetMedia hook. For infinite scroll, react-query useInfiniteQuery is better.
  // For now, we fetch a single large page or regular page since the hook currently does not support infinite query.
  // Ideally, useGetMedia would be updated to useInfiniteQuery. Let's just use it as is for the current scope.
  const typeFilter = filterType === 'images' ? 'image' : filterType === 'videos' ? 'video' : undefined;
  const { data: mediaItems, isLoading, refetch } = useGetMedia(siteId, typeFilter);

  // Filter client side by search for now, since API doesn't accept search text yet
  const filteredItems = React.useMemo(() => {
    if (!mediaItems) return [];
    if (!debouncedSearch) return mediaItems;
    const lower = debouncedSearch.toLowerCase();
    return mediaItems.filter((item: any) => 
      item.publicId.toLowerCase().includes(lower) || 
      item.altText?.toLowerCase().includes(lower)
    );
  }, [mediaItems, debouncedSearch]);

  const handleConfirm = () => {
    if (selectedMedia && onSelect) {
      onSelect(selectedMedia);
      onOpenChange(false);
    }
  };

  const handleUploadSuccess = (mediaRecord: any) => {
    refetch(); // refresh the library
    setActiveTab('library');
    setSelectedMedia(mediaRecord); // auto-select the newly uploaded file
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Media Library
          </DialogTitle>
        </DialogHeader>

        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as any)} 
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="px-4 py-2 border-b shrink-0 flex items-center justify-between bg-neutral-50/50">
            <TabsList>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="library" className="flex-1 flex flex-col min-h-0 m-0 border-0 outline-none">
            {/* Toolbar */}
            <div className="p-4 border-b shrink-0 flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                <Input 
                  placeholder="Search media..." 
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex bg-neutral-100 p-1 rounded-lg">
                {(['all', 'images', 'videos'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${filterType === type ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
                    disabled={accept !== 'all' && type !== accept && type !== 'all'}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 bg-neutral-50/30">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500">
                  <ImageIcon className="h-12 w-12 mb-4 text-neutral-300" />
                  <p className="text-lg font-medium text-neutral-900">No media found</p>
                  <p className="mt-1">Try adjusting your filters or upload new files.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item: any) => (
                    <MediaCard 
                      key={item.id} 
                      media={item} 
                      isSelected={selectedMedia?.id === item.id}
                      onSelect={setSelectedMedia}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t shrink-0 flex items-center justify-between bg-white">
              <div className="text-sm text-neutral-500">
                {selectedMedia ? `1 item selected` : 'No items selected'}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={handleConfirm} disabled={!selectedMedia}>
                  Insert Media
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 overflow-y-auto p-6 m-0 border-0 outline-none">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-medium mb-4">Upload New Files</h3>
              <MediaUploader 
                siteId={siteId} 
                accept={accept} 
                onUpload={handleUploadSuccess} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}