'use client';

import React, { useState } from 'react';
import { Search, Loader2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useGetMedia } from '@/hooks/useMedia';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaUploader } from '@/components/media/MediaUploader';
import { useDebounce } from '@/hooks/useDebounce';

export default function GlobalMediaPage() {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos'>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const typeFilter = filterType === 'images' ? 'image' : filterType === 'videos' ? 'video' : undefined;
  const { data: mediaItems, isLoading, refetch } = useGetMedia(undefined, typeFilter);

  const filteredItems = React.useMemo(() => {
    if (!mediaItems) return [];
    if (!debouncedSearch) return mediaItems;
    const lower = debouncedSearch.toLowerCase();
    return mediaItems.filter((item: any) => 
      item.publicId.toLowerCase().includes(lower) || 
      item.altText?.toLowerCase().includes(lower)
    );
  }, [mediaItems, debouncedSearch]);

  const handleUploadSuccess = () => {
    refetch();
    setActiveTab('library');
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Media Library</h1>
          <p className="text-muted-foreground mt-1">Manage all your images and videos across all sites.</p>
        </div>
      </div>

      <div className="flex-1 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col min-h-0 overflow-hidden">
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as any)} 
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="px-6 py-4 border-b shrink-0 flex items-center justify-between bg-neutral-50/50">
            <TabsList>
              <TabsTrigger value="library">Library View</TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                Upload New
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="library" className="flex-1 flex flex-col min-h-0 m-0 border-0 outline-none">
            {/* Toolbar */}
            <div className="p-4 px-6 border-b shrink-0 flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <Input 
                  placeholder="Search media by name or alt text..." 
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
                    className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${filterType === type ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/30">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center text-neutral-500">
                  <ImageIcon className="h-12 w-12 mb-4 text-neutral-300" />
                  <p className="text-lg font-medium text-neutral-900">No media found</p>
                  <p className="mt-1">Try adjusting your search or upload new files.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredItems.map((item: any) => (
                    <MediaCard 
                      key={item.id} 
                      media={item} 
                      onDeleteSuccess={refetch}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 overflow-y-auto p-8 m-0 border-0 outline-none">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl font-medium mb-6">Upload Files to Global Library</h3>
              <MediaUploader 
                accept="all" 
                onUpload={handleUploadSuccess} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}