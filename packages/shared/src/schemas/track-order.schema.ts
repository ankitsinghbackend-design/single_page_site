import { z } from 'zod';

export const TrackOrderPageSchema = z.object({
  heading: z.string(),
  subheading: z.string(),
  trackingProviderUrl: z.string().url(),
  supportEmail: z.string().email(),
});

export type TrackOrderPageType = z.infer<typeof TrackOrderPageSchema>;
