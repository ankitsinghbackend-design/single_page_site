'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCreateSite } from '@/hooks/useSites';

const SiteFormSchema = z.object({
  name: z.string().min(2, "Site name must be at least 2 characters"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export default function NewSitePage() {
  const router = useRouter();
  const { mutateAsync: createSite, isPending } = useCreateSite();

  const form = useForm<z.infer<typeof SiteFormSchema>>({
    resolver: zodResolver(SiteFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      status: 'draft',
    },
  });

  const nameValue = form.watch('name');

  // Auto-generate slug from name if user hasn't explicitly edited the slug
  useEffect(() => {
    if (nameValue && !form.formState.dirtyFields.slug) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, form]);

  const onSubmit = async (data: z.infer<typeof SiteFormSchema>) => {
    try {
      const newSite = await createSite(data);
      if (newSite && newSite.id) {
        router.push(`/sites/${newSite.id}`);
      }
    } catch (error) {
      // Error is handled by the hook (toast)
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/sites">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Create New Site</h1>
          <p className="text-sm text-neutral-500">Configure the basic details for your new funnel.</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. CoreVita Summer Campaign" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 px-3 text-neutral-500 sm:text-sm">
                      corevita.com/
                    </span>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="rounded-l-none" 
                        placeholder="summer-campaign" 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief internal description of this site..." 
                      className="h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft (Private)</SelectItem>
                      <SelectItem value="published">Published (Public)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isPending} className="px-8">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Site
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}