'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrackOrderPageSchema, TrackOrderPageType } from '@corevita/shared/src/schemas/track-order.schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useUpsertPageConfig } from '@/hooks/usePageConfig';

interface TrackOrderFormProps {
  siteId: string;
  initialData?: any;
  isLoading?: boolean;
}

const defaultValues: TrackOrderPageType = {
  heading: 'Track Your Order',
  subheading: 'Enter your tracking number below to see the latest updates on your shipment.',
  trackingProviderUrl: 'https://track.aftership.com/',
  supportEmail: 'support@corevita.com',
};

export function TrackOrderForm({ siteId, initialData, isLoading }: TrackOrderFormProps) {
  const { mutate: upsertConfig, isPending: isSaving } = useUpsertPageConfig(siteId, 'track-order-page');

  const form = useForm<TrackOrderPageType>({
    resolver: zodResolver(TrackOrderPageSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = (data: TrackOrderPageType) => {
    upsertConfig(data);
  };

  const currentProviderUrl = form.watch('trackingProviderUrl');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <FormField
              control={form.control}
              name="heading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Heading</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Track Your Order" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subheading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subheading / Instructions</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter your tracking number below..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trackingProviderUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Provider Embed URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://track.aftership.com/" type="url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="support@domain.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
            <h3 className="font-semibold text-lg mb-4">Tracking Preview</h3>
            <div className="flex-1 bg-neutral-100 rounded-lg overflow-hidden border min-h-[400px]">
              {currentProviderUrl && currentProviderUrl.startsWith('http') ? (
                <iframe 
                  src={currentProviderUrl}
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-0"
                  title="Tracking Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400 p-8 text-center">
                  Please enter a valid URL (starting with http:// or https://) to see a preview of the tracking widget.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t flex justify-end items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <Button type="submit" disabled={isSaving} size="lg" className="px-8 font-semibold">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}