'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetSites } from '@/hooks/useSites';
import { useGetMedia } from '@/hooks/useMedia';
import { Globe, Image as ImageIcon, Plus, ArrowRight, LayoutDashboard, FileText, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MediaLibrary } from '@/components/media/MediaLibrary';

export default function DashboardHome() {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const { data: sitesData, isLoading: sitesLoading } = useGetSites(1, 5);
  const { data: mediaData, isLoading: mediaLoading } = useGetMedia();

  const sites = sitesData?.data || [];
  const totalSites = sitesData?.pagination?.total || 0;
  
  // Use backend status counts for accuracy (or fallback to 0)
  const publishedSites = sitesData?.statusCounts?.published || 0;
  const draftSites = sitesData?.statusCounts?.draft || 0;
  const totalMedia = mediaData?.length || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
          <p className="mt-2 text-sm text-neutral-500">Welcome back! Here is an overview of your CoreVita sites.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsMediaLibraryOpen(true)}>
            <ImageIcon className="mr-2 h-4 w-4" /> Media Library
          </Button>
          <Link href="/sites/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3"><Globe className="h-6 w-6 text-primary" /></div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Sites</p>
              <p className="text-2xl font-semibold text-neutral-900">{sitesLoading ? '-' : totalSites}</p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3"><LayoutDashboard className="h-6 w-6 text-green-600" /></div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Published</p>
              <p className="text-2xl font-semibold text-neutral-900">{sitesLoading ? '-' : publishedSites}</p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-neutral-100 p-3"><FileText className="h-6 w-6 text-neutral-600" /></div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Drafts</p>
              <p className="text-2xl font-semibold text-neutral-900">{sitesLoading ? '-' : draftSites}</p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3"><ImageIcon className="h-6 w-6 text-blue-600" /></div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Media Items</p>
              <p className="text-2xl font-semibold text-neutral-900">{mediaLoading ? '-' : totalMedia}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sites Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Sites</h2>
          <Link href="/sites" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Quick Links</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sitesLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-neutral-500">Loading sites...</TableCell>
                </TableRow>
              ) : sites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-neutral-500">No sites found. Create your first site!</TableCell>
                </TableRow>
              ) : (
                sites.map((site: any) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">
                      <Link href={`/sites/${site.id}`} className="hover:underline hover:text-primary">
                        {site.name}
                      </Link>
                      <div className="text-xs text-neutral-500">/{site.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={site.status === 'published' ? 'default' : 'secondary'} className={site.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                        {site.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-neutral-500">
                      {new Date(site.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/sites/${site.id}/landing-page`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-neutral-500"><FileText className="h-4 w-4" /></Button>
                        </Link>
                        <Link href={`/sites/${site.id}/product-page`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-neutral-500"><ShoppingCart className="h-4 w-4" /></Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <MediaLibrary open={isMediaLibraryOpen} onOpenChange={setIsMediaLibraryOpen} />
    </div>
  );
}