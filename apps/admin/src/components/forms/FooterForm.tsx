'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FooterSchema, FooterType } from '@corevita/shared/src/schemas/footer.schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { useUpsertPageConfig } from '@/hooks/usePageConfig';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// dnd-kit
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FooterFormProps {
  siteId: string;
  initialData?: any;
  isLoading?: boolean;
}

const defaultValues: FooterType = {
  logoText: 'CoreVita',
  quickLinks: [
    { label: 'Home', url: '/' },
    { label: 'Products', url: '/products' },
    { label: 'Contact', url: '/contact' },
  ],
  subscribeHeading: 'Subscribe to our newsletter',
  subscribeSubtext: 'Get the latest updates and offers.',
  copyrightText: '© {year} CoreVita. All rights reserved.',
  socialLinks: [],
};

function SortableItemWrapper({ id, children }: { id: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="relative flex gap-2 items-start bg-neutral-50 p-4 border rounded-md mb-3">
      <div {...attributes} {...listeners} className="mt-2 cursor-grab text-neutral-400 hover:text-neutral-900">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-4">
        {children}
      </div>
    </div>
  );
}

export function FooterForm({ siteId, initialData, isLoading }: FooterFormProps) {
  const { mutate: upsertConfig, isPending: isSaving } = useUpsertPageConfig(siteId, 'footer');

  const form = useForm<FooterType>({
    resolver: zodResolver(FooterSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const quickLinks = useFieldArray({ control: form.control, name: "quickLinks" });
  const socialLinks = useFieldArray({ control: form.control, name: "socialLinks" });

  const onSubmit = (data: FooterType) => {
    upsertConfig(data);
  };

  const handleDragEnd = (event: any, fieldArray: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fieldArray.fields.findIndex((f: any) => f.id === active.id);
      const newIndex = fieldArray.fields.findIndex((f: any) => f.id === over.id);
      fieldArray.move(oldIndex, newIndex);
    }
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
        <Accordion type="multiple" defaultValue={["general", "links", "social"]} className="w-full">
          
          <AccordionItem value="general" className="border bg-white rounded-lg mb-4 px-4">
            <AccordionTrigger className="font-semibold hover:no-underline">General Settings</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="logoText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo Text</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscribeHeading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscribe Section Heading</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscribeSubtext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscribe Subtext</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="copyrightText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copyright Text</FormLabel>
                    <div className="text-xs text-neutral-500 mb-2">Use {'{year}'} to automatically insert the current year.</div>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="links" className="border bg-white rounded-lg mb-4 px-4">
            <AccordionTrigger className="font-semibold hover:no-underline">Quick Links</AccordionTrigger>
            <AccordionContent className="pt-4 border-t">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, quickLinks)}>
                <SortableContext items={quickLinks.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  {quickLinks.fields.map((field, index) => (
                    <SortableItemWrapper key={field.id} id={field.id}>
                      <div className="flex items-center gap-4 w-full">
                        <FormField control={form.control} name={\`quickLinks.\${index}.label\`} render={({ field }) => (
                          <FormItem className="flex-1"><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={\`quickLinks.\${index}.url\`} render={({ field }) => (
                          <FormItem className="flex-[2]"><FormLabel>URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" className="mt-8 text-red-500" onClick={() => quickLinks.remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </SortableItemWrapper>
                  ))}
                </SortableContext>
              </DndContext>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => quickLinks.append({ label: '', url: '' })}>
                <Plus className="mr-2 h-4 w-4" /> Add Quick Link
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="social" className="border bg-white rounded-lg mb-4 px-4">
            <AccordionTrigger className="font-semibold hover:no-underline">Social Links</AccordionTrigger>
            <AccordionContent className="pt-4 border-t">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, socialLinks)}>
                <SortableContext items={socialLinks.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  {socialLinks.fields.map((field, index) => (
                    <SortableItemWrapper key={field.id} id={field.id}>
                      <div className="flex items-center gap-4 w-full">
                        <FormField control={form.control} name={\`socialLinks.\${index}.platform\`} render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Platform</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="twitter">Twitter / X</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={\`socialLinks.\${index}.url\`} render={({ field }) => (
                          <FormItem className="flex-[2]"><FormLabel>URL</FormLabel><FormControl><Input {...field} type="url" placeholder="https://" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" className="mt-8 text-red-500" onClick={() => socialLinks.remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </SortableItemWrapper>
                  ))}
                </SortableContext>
              </DndContext>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => socialLinks.append({ platform: 'facebook', url: '' })}>
                <Plus className="mr-2 h-4 w-4" /> Add Social Link
              </Button>
            </AccordionContent>
          </AccordionItem>

        </Accordion>

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