'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetSites, useUpdateSite, useDeleteSite } from '@/hooks/useSites';
import { Plus, Search, MoreHorizontal, Edit, LayoutTemplate, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/hooks/useDebounce';

export default function SitesListPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Fetching all for now since pagination and search aren't fully supported in API args yet
  const { data: sitesData, isLoading } = useGetSites(1, 100);
  const { mutate: updateSite } = useUpdateSite();
  const { mutate: deleteSite } = useDeleteSite();

  const sites = sitesData?.items || [];

  const filteredSites = React.useMemo(() => {
    let result = sites;
    if (filterStatus !== 'all') {
      result = result.filter((s: any) => s.status === filterStatus);
    }
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter((s: any) => 
        s.name.toLowerCase().includes(lower) || 
        s.slug.toLowerCase().includes(lower)
      );
    }
    return result;
  }, [sites, filterStatus, debouncedSearch]);

  const toggleStatus = (site: any) => {
    const newStatus = site.status === 'published' ? 'draft' : 'published';
    updateSite({ id: site.id, data: { status: newStatus } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this site? This will permanently delete all configurations and media.")) {
      deleteSite(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Sites</h1>
          <p className="mt-2 text-sm text-neutral-500">Manage all your sales funnels and pages.</p>
        </div>
        <div>
          <Link href="/sites/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Site
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
          <Input 
            placeholder="Search sites..." 
            className="pl-9 bg-neutral-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-neutral-500">Loading sites...</TableCell>
                </TableRow>
              ) : filteredSites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-neutral-500">
                    <Globe className="mx-auto h-8 w-8 text-neutral-300 mb-3" />
                    <p>No sites found matching your criteria.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSites.map((site: any) => (
                  <TableRow key={site.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link href={\`/sites/\${site.id}\`} className="font-semibold text-neutral-900 hover:text-primary transition-colors">
                          {site.name}
                        </Link>
                        <span className="text-xs text-neutral-500 font-mono mt-0.5">/{site.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={site.status === 'published' ? 'default' : site.status === 'archived' ? 'outline' : 'secondary'} 
                             className={site.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                        {site.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-neutral-500">
                      {new Date(site.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={\`/sites/\${site.id}\`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <LayoutTemplate className="mr-2 h-4 w-4" /> Open Editor
                            </DropdownMenuItem>
                          </Link>
                          {/* Edit Meta is a placeholder for a settings modal, could map to a settings tab later */}
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit Meta
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer" onClick={() => toggleStatus(site)}>
                            {site.status === 'published' ? 'Unpublish' : 'Publish'} Site
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => handleDelete(site.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Site
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}