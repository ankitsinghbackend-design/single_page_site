import { db } from '../../config/db';
import { footerConfigs } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { FooterSchema, FooterType } from '@corevita/shared';

export const footerService = {
  async getConfig(siteId: string) {
    const record = await db.query.footerConfigs.findFirst({
      where: eq(footerConfigs.siteId, siteId),
    });

    if (!record) {
      const error = new Error('Footer config not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return record.footerJson || null;
  },

  async upsertConfig(siteId: string, payload: FooterType) {
    const validated = FooterSchema.parse(payload);

    const updateValues = {
      footerJson: validated,
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(footerConfigs)
      .set(updateValues)
      .where(eq(footerConfigs.siteId, siteId))
      .returning();

    const resultRecord = updated || (
      await db
        .insert(footerConfigs)
        .values({ siteId, ...updateValues })
        .onConflictDoUpdate({
          target: footerConfigs.siteId,
          set: updateValues,
        })
        .returning()
    )[0];

    return resultRecord.footerJson;
  },
};
