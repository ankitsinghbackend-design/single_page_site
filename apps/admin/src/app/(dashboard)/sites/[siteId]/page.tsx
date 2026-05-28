'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetSite, useUpdateSite, useDeleteSite } from '@/hooks/useSites';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, ShoppingCart, Mail, Truck, Settings, Image as ImageIcon, ExternalLink, LayoutTemplate, Edit, Trash2, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function SiteOverviewPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const router = useRouter();

  const { data: site, isLoading } = useGetSite(siteId);
  const { mutate: updateSite } = useUpdateSite();
  const { mutateAsync: deleteSite, isPending: isDeleting } = useDeleteSite();

  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!site) {
    return <div className="text-center py-12">Site not found.</div>;
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== site.name) return;
    
    try {
      await deleteSite(site.id);
      router.push('/sites');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = () => {
    const newStatus = site.status === 'published' ? 'draft' : 'published';
    updateSite({ id: site.id, data: { status: newStatus } });
  };

  const editors = [
    { title: 'Landing Page', icon: FileText, href: \`/sites/\${site.id}/landing-page\`, desc: 'Hero, benefits, and main CTA' },
    { title: 'Product Page', icon: ShoppingCart, href: \`/sites/\${site.id}/product-page\`, desc: 'Pricing, checkout, and details' },
    { title: 'Contact Page', icon: Mail, href: \`/sites/\${site.id}/contact-page\`, desc: 'Support info and contact form' },
    { title: 'Track Order', icon: Truck, href: \`/sites/\${site.id}/track-order-page\`, desc: 'Order status lookup interface' },
    { title: 'Footer', icon: Settings, href: \`/sites/\${site.id}/footer\`, desc: 'Global footer links and info' },
    { title: 'Media Library', icon: ImageIcon, href: \`/sites/\${site.id}/media\`, desc: 'Site-specific images and videos' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{site.name}</h1>
            <Badge variant={site.status === 'published' ? 'default' : 'secondary'} className={site.status === 'published' ? 'bg-green-100 text-green-800' : ''}>
              {site.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-neutral-500 font-mono">/{site.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={toggleStatus}>
            {site.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>
          {site.status === 'published' && (
            <a href={\`http://localhost:3000/\${site.slug}\`} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">
                <ExternalLink className="mr-2 h-4 w-4" /> Preview
              </Button>
            </a>
          )}
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4 text-neutral-500" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Page Editors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {editors.map((editor) => (
            <div key={editor.title} className="group relative flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-all hover:border-primary hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    <editor.icon className="h-6 w-6" />
                  </div>
                  <Link href={editor.href}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </Button>
                  </Link>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">{editor.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{editor.desc}</p>
              </div>
              <div className="mt-6 flex items-center text-xs text-neutral-400">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                Updated recently
              </div>
              <Link href={editor.href} className="absolute inset-0" aria-label={\`Edit \${editor.title}\`} />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden mt-12">
        <div className="border-b border-red-100 bg-red-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-red-900 flex items-center">
            <Trash2 className="mr-2 h-5 w-5" /> Danger Zone
          </h2>
        </div>
        <div className="px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-medium text-neutral-900">Delete Site</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-xl">
              Permanently remove this site and all of its configurations, media, and analytics. This action cannot be undone.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Site</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the <strong>{site.name}</strong> site and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <p className="text-sm text-neutral-700 mb-2">
                  Please type <strong>{site.name}</strong> to confirm.
                </p>
                <Input 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={site.name}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== site.name || isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Permanently Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}