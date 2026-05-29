import { db } from '../../config/db';
import { productPages } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { ProductPageSchema, ProductPageType } from '@corevita/shared';

export const productPageService = {
  async getConfig(siteId: string) {
    const record = await db.query.productPages.findFirst({
      where: eq(productPages.siteId, siteId),
    });

    if (!record) {
      const error = new Error('Product page config not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Map database properties (which may be null initially) to return schema shape
    return {
      productName: record.productName || "",
      price: record.price ? parseFloat(record.price) : 0,
      originalPrice: record.originalPrice ? parseFloat(record.originalPrice) : 0,
      stockBadge: record.stockBadge || "",
      description: record.descriptionJson !== null ? record.descriptionJson : "",
      benefits: record.benefitsJson || [],
      pricingOptions: record.pricingOptionsJson || [],
      autoRefillEnabled: record.autoRefillEnabled,
      autoRefillLabel: record.autoRefillLabel,
      whyModernFood: record.whyModernFoodJson || null,
      naturesGold: record.naturesGoldJson || null,
      videoTestimonials: record.videoTestimonialsJson || [],
      textReviews: record.textReviewsJson || [],
      testimonialSectionHeading: record.testimonialSectionHeading || "",
    };
  },

  async upsertConfig(siteId: string, payload: ProductPageType) {
    // Validate payload against schema
    const validated = ProductPageSchema.parse(payload);

    const updateValues = {
      productName: validated.productName,
      price: validated.price?.toString() ?? '0',
      originalPrice: validated.originalPrice?.toString() ?? '0',
      stockBadge: validated.stockBadge,
      descriptionJson: validated.description,
      benefitsJson: validated.benefits ?? [],
      pricingOptionsJson: validated.pricingOptions ?? [],
      autoRefillEnabled: validated.autoRefillEnabled ?? false,
      autoRefillLabel: validated.autoRefillLabel,
      whyModernFoodJson: validated.whyModernFood ?? null,
      naturesGoldJson: validated.naturesGold ?? null,
      videoTestimonialsJson: validated.videoTestimonials ?? [],
      textReviewsJson: validated.textReviews ?? [],
      testimonialSectionHeading: validated.testimonialSectionHeading,
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(productPages)
      .set(updateValues)
      .where(eq(productPages.siteId, siteId))
      .returning();

    const resultRecord = updated || (
      await db
        .insert(productPages)
        .values({ siteId, ...updateValues })
        .onConflictDoUpdate({
          target: productPages.siteId,
          set: updateValues,
        })
        .returning()
    )[0];

    return {
      productName: resultRecord.productName,
      price: resultRecord.price ? parseFloat(resultRecord.price) : 0,
      originalPrice: resultRecord.originalPrice ? parseFloat(resultRecord.originalPrice) : 0,
      stockBadge: resultRecord.stockBadge,
      description: resultRecord.descriptionJson,
      benefits: resultRecord.benefitsJson,
      pricingOptions: resultRecord.pricingOptionsJson,
      autoRefillEnabled: resultRecord.autoRefillEnabled,
      autoRefillLabel: resultRecord.autoRefillLabel,
      whyModernFood: resultRecord.whyModernFoodJson,
      naturesGold: resultRecord.naturesGoldJson,
      videoTestimonials: resultRecord.videoTestimonialsJson,
      textReviews: resultRecord.textReviewsJson,
      testimonialSectionHeading: resultRecord.testimonialSectionHeading,
    };
  },
};
