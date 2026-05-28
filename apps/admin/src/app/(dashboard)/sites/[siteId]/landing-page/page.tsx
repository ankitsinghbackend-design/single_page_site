'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetPageConfig } from '@/hooks/usePageConfig';
import { useGetSite } from '@/hooks/useSites';
import { LandingPageForm } from '@/components/forms/LandingPageForm';
import { Loader2 } from 'lucide-react';

export default function LandingPageEditor() {
  const params = useParams();
  const siteId = params.siteId as string;

  const { data: site, isLoading: siteLoading } = useGetSite(siteId);
  const { data: config, isLoading: configLoading } = useGetPageConfig(siteId, 'landing-page');

  if (siteLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Landing Page</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Manage the content and configuration for the landing page of <span className="font-medium text-neutral-900">{site?.name}</span>.
        </p>
      </div>

      <LandingPageForm 
        siteId={siteId} 
        initialData={config || undefined} 
        isLoading={configLoading} 
      />
    </div>
  );
}