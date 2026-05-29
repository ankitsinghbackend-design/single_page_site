'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LandingPageSchema, LandingPageType } from '@corevita/shared/src/schemas/landing-page.schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ImagePicker } from '@/components/media/ImagePicker';
import { Loader2 } from 'lucide-react';
import { useUpsertPageConfig } from '@/hooks/usePageConfig';

interface LandingPageFormProps {
  siteId: string;
  initialData?: any;
  isLoading?: boolean;
}

const defaultValues: LandingPageType = {
  announcementBar: { text: '', bgColor: '#000000', textColor: '#ffffff', isVisible: true },
  hero: { headline: '', headlineHighlight: '', subheadline: '', bodyText: '', ctaLabel: '', ctaUrl: '', productImagePublicId: '' },
  stats: [{ percentage: 0, description: '' }, { percentage: 0, description: '' }, { percentage: 0, description: '' }],
  reviewsHeading: '',
};

export function LandingPageForm({ siteId, initialData, isLoading }: LandingPageFormProps) {
  const { mutate: upsertConfig, isPending: isSaving } = useUpsertPageConfig(siteId, 'landing-page');

  const form = useForm<LandingPageType>({
    resolver: zodResolver(LandingPageSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const { fields: statFields } = useFieldArray({
    name: "stats",
    control: form.control,
  });

  const onSubmit = (data: LandingPageType) => {
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
        <Accordion multiple defaultValue={["announcement", "hero", "stats", "reviews"]} className="w-full">
          
          {/* Section 1: Announcement Bar */}
          <AccordionItem value="announcement" className="border bg-white rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline font-semibold">Announcement Bar</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="announcementBar.isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Visible</FormLabel>
                      <div className="text-sm text-neutral-500">Show the announcement bar at the top of the page.</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="announcementBar.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Content</FormLabel>
                    <FormControl><Input {...field} placeholder="Free shipping on orders over $50!" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="announcementBar.bgColor"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input type="color" {...field} className="w-12 h-10 p-1 cursor-pointer" />
                          <Input type="text" {...field} className="flex-1" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="announcementBar.textColor"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Text Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input type="color" {...field} className="w-12 h-10 p-1 cursor-pointer" />
                          <Input type="text" {...field} className="flex-1" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Hero Section */}
          <AccordionItem value="hero" className="border bg-white rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline font-semibold">Hero Section</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="hero.headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl><Textarea {...field} placeholder="Main large text on the landing page..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hero.headlineHighlight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline Highlight (Underlined Portion)</FormLabel>
                    <FormControl><Input {...field} placeholder="Word to highlight" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hero.subheadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subheadline</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hero.bodyText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Text</FormLabel>
                    <FormControl><Textarea {...field} className="h-24" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hero.ctaLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Button Label</FormLabel>
                      <FormControl><Input {...field} placeholder="Shop Now" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hero.ctaUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Button URL</FormLabel>
                      <FormControl><Input {...field} placeholder="/products/..." /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="hero.productImagePublicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <FormControl>
                      <ImagePicker value={field.value} onChange={field.onChange} siteId={siteId} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Section 3: Stats */}
          <AccordionItem value="stats" className="border bg-white rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline font-semibold">Stats</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 border-t">
              {statFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-3 gap-4 items-end bg-neutral-50 p-4 rounded-md border">
                  <FormField
                    control={form.control}
                    name={`stats.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage (Number)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`stats.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Description Text</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Section 4: Reviews Section */}
          <AccordionItem value="reviews" className="border bg-white rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline font-semibold">Reviews Section</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="reviewsHeading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Heading</FormLabel>
                    <FormControl><Input {...field} placeholder="Here is what they said:" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        {/* Footer Fixed Bar */}
        <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <div className="text-sm text-neutral-500">
            {/* Could show last saved timestamp here if tracked */}
            Fill all required fields to save.
          </div>
          <Button type="submit" disabled={isSaving} size="lg" className="px-8 font-semibold">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}