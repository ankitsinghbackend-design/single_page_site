import { z } from 'zod';

export const FooterSchema = z.object({
  logoText: z.string(),
  quickLinks: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
    })
  ),
  subscribeHeading: z.string(),
  subscribeSubtext: z.string(),
  copyrightText: z.string(),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url(),
    })
  ).optional(),
});

export type FooterType = z.infer<typeof FooterSchema>;
