'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactPageSchema, ContactPageType } from '@corevita/shared/src/schemas/contact-page.schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useUpsertPageConfig } from '@/hooks/usePageConfig';

interface ContactPageFormProps {
  siteId: string;
  initialData?: any;
  isLoading?: boolean;
}

const defaultValues: ContactPageType = {
  heading: 'Contact Us',
  fields: {
    name: true,
    email: true,
    phone: false,
    comment: true,
  },
  submitLabel: 'Send Message',
  successMessage: 'Thank you for contacting us! We will get back to you shortly.',
};

export function ContactPageForm({ siteId, initialData, isLoading }: ContactPageFormProps) {
  const { mutate: upsertConfig, isPending: isSaving } = useUpsertPageConfig(siteId, 'contact-page');

  const form = useForm<ContactPageType>({
    resolver: zodResolver(ContactPageSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = (data: ContactPageType) => {
    upsertConfig(data);
  };

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
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <FormField
            control={form.control}
            name="heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Heading</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Contact Us" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 border p-4 rounded-lg bg-neutral-50">
            <h3 className="font-semibold text-sm">Visible Form Fields</h3>
            
            <FormField
              control={form.control}
              name="fields.name"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="font-normal">Name Field</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fields.email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="font-normal">Email Field</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fields.phone"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="font-normal">Phone Field</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fields.comment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="font-normal">Comment / Message Field</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="submitLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Submit Button Label</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Send Message" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="successMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Success Message</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Message to show after submission..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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