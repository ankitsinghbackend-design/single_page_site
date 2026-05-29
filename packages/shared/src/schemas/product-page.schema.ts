import { z } from 'zod';

export const PricingOptionSchema = z.object({
  label: z.string(),
  badge: z.string().optional(),
  savePct: z.number(),
  price: z.number(),
  originalPrice: z.number(),
  includesFreeShipping: z.boolean(),
});

export const BenefitItemSchema = z.object({
  icon: z.string().optional(),
  text: z.string(),
});

export const WhyModernFoodSchema = z.object({
  heading: z.string(),
  body: z.string(),
  imagePublicId: z.string(),
  stats: z.array(
    z.object({
      pct: z.number(),
      label: z.string(),
    })
  ),
});

export const NaturesGoldSchema = z.object({
  heading: z.string(),
  intro: z.string(),
  body: z.string(),
  imagePublicId: z.string(),
});

export const VideoTestimonialSchema = z.object({
  videoPublicId: z.string(),
  thumbnailPublicId: z.string(),
  name: z.string(),
});

export const TextReviewSchema = z.object({
  avatarPublicId: z.string(),
  headline: z.string(),
  rating: z.number().min(1).max(5),
  body: z.string(),
  reviewerName: z.string(),
  isVerified: z.boolean(),
});

export const ProductPageSchema = z.object({
  productName: z.string().optional().default(''),
  price: z.number().optional().default(0),
  originalPrice: z.number().optional().default(0),
  stockBadge: z.string().optional().default(''),
  description: z.string().optional().default(''),
  benefits: z.array(BenefitItemSchema).optional().default([]),
  pricingOptions: z.array(PricingOptionSchema).optional().default([]),
  autoRefillEnabled: z.boolean().optional().default(false),
  autoRefillLabel: z.string().optional().default(''),
  whyModernFood: WhyModernFoodSchema.optional().nullable(),
  naturesGold: NaturesGoldSchema.optional().nullable(),
  videoTestimonials: z.array(VideoTestimonialSchema).optional().default([]),
  textReviews: z.array(TextReviewSchema).optional().default([]),
  testimonialSectionHeading: z.string().optional().default(''),
});

export type PricingOptionType = z.infer<typeof PricingOptionSchema>;
export type BenefitItemType = z.infer<typeof BenefitItemSchema>;
export type WhyModernFoodType = z.infer<typeof WhyModernFoodSchema>;
export type NaturesGoldType = z.infer<typeof NaturesGoldSchema>;
export type VideoTestimonialType = z.infer<typeof VideoTestimonialSchema>;
export type TextReviewType = z.infer<typeof TextReviewSchema>;
export type ProductPageType = z.infer<typeof ProductPageSchema>;
