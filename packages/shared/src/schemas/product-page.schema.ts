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
  productName: z.string(),
  price: z.number(),
  originalPrice: z.number(),
  stockBadge: z.string(),
  description: z.string(),
  benefits: z.array(BenefitItemSchema),
  pricingOptions: z.array(PricingOptionSchema),
  autoRefillEnabled: z.boolean(),
  autoRefillLabel: z.string(),
  whyModernFood: WhyModernFoodSchema,
  naturesGold: NaturesGoldSchema,
  videoTestimonials: z.array(VideoTestimonialSchema),
  textReviews: z.array(TextReviewSchema),
  testimonialSectionHeading: z.string(),
});

export type PricingOptionType = z.infer<typeof PricingOptionSchema>;
export type BenefitItemType = z.infer<typeof BenefitItemSchema>;
export type WhyModernFoodType = z.infer<typeof WhyModernFoodSchema>;
export type NaturesGoldType = z.infer<typeof NaturesGoldSchema>;
export type VideoTestimonialType = z.infer<typeof VideoTestimonialSchema>;
export type TextReviewType = z.infer<typeof TextReviewSchema>;
export type ProductPageType = z.infer<typeof ProductPageSchema>;
