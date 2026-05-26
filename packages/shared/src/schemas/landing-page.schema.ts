import { z } from 'zod';

export const AnnouncementBarSchema = z.object({
  text: z.string(),
  bgColor: z.string(),
  textColor: z.string(),
  isVisible: z.boolean(),
});

export const HeroSectionSchema = z.object({
  headline: z.string(),
  headlineHighlight: z.string(),
  subheadline: z.string(),
  bodyText: z.string(),
  ctaLabel: z.string(),
  ctaUrl: z.string(),
  productImagePublicId: z.string(),
});

export const StatItemSchema = z.object({
  percentage: z.number(),
  description: z.string(),
});

export const LandingPageSchema = z.object({
  announcementBar: AnnouncementBarSchema,
  hero: HeroSectionSchema,
  stats: z.array(StatItemSchema).length(3),
  reviewsHeading: z.string(),
});

export type AnnouncementBarType = z.infer<typeof AnnouncementBarSchema>;
export type HeroSectionType = z.infer<typeof HeroSectionSchema>;
export type StatItemType = z.infer<typeof StatItemSchema>;
export type LandingPageType = z.infer<typeof LandingPageSchema>;
