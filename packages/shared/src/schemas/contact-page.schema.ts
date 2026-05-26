import { z } from 'zod';

export const ContactPageSchema = z.object({
  heading: z.string(),
  fields: z.object({
    name: z.boolean(),
    email: z.boolean(),
    phone: z.boolean(),
    comment: z.boolean(),
  }),
  submitLabel: z.string(),
  successMessage: z.string(),
});

export type ContactPageType = z.infer<typeof ContactPageSchema>;
