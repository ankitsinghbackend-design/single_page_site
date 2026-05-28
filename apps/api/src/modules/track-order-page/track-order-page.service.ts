import { db } from '../../config/db';
import { trackOrderPages } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { TrackOrderPageSchema, TrackOrderPageType } from '@corevita/shared';

export const trackOrderPageService = {
  async getConfig(siteId: string) {
    const record = await db.query.trackOrderPages.findFirst({
      where: eq(trackOrderPages.siteId, siteId),
    });

    if (!record) {
      const error = new Error('Track order page config not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return {
      heading: record.heading,
      subheading: record.subheading,
      trackingProviderUrl: record.trackingProviderUrl,
      supportEmail: record.supportEmail,
    };
  },

  async upsertConfig(siteId: string, payload: TrackOrderPageType) {
    const validated = TrackOrderPageSchema.parse(payload);

    const updateValues = {
      heading: validated.heading,
      subheading: validated.subheading,
      trackingProviderUrl: validated.trackingProviderUrl,
      supportEmail: validated.supportEmail,
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(trackOrderPages)
      .set(updateValues)
      .where(eq(trackOrderPages.siteId, siteId))
      .returning();

    const resultRecord = updated || (
      await db
        .insert(trackOrderPages)
        .values({ siteId, ...updateValues })
        .onConflictDoUpdate({
          target: trackOrderPages.siteId,
          set: updateValues,
        })
        .returning()
    )[0];

    return {
      heading: resultRecord.heading,
      subheading: resultRecord.subheading,
      trackingProviderUrl: resultRecord.trackingProviderUrl,
      supportEmail: resultRecord.supportEmail,
    };
  },
};
