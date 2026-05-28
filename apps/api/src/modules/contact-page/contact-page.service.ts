import { db } from '../../config/db';
import { contactPages } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { ContactPageSchema, ContactPageType } from '@corevita/shared';

export const contactPageService = {
  async getConfig(siteId: string) {
    const record = await db.query.contactPages.findFirst({
      where: eq(contactPages.siteId, siteId),
    });

    if (!record) {
      const error = new Error('Contact page config not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return {
      heading: record.heading,
      fields: record.fieldsJson || null,
      submitLabel: record.submitLabel,
      successMessage: record.successMessage,
    };
  },

  async upsertConfig(siteId: string, payload: ContactPageType) {
    const validated = ContactPageSchema.parse(payload);

    const updateValues = {
      heading: validated.heading,
      fieldsJson: validated.fields,
      submitLabel: validated.submitLabel,
      successMessage: validated.successMessage,
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(contactPages)
      .set(updateValues)
      .where(eq(contactPages.siteId, siteId))
      .returning();

    const resultRecord = updated || (
      await db
        .insert(contactPages)
        .values({ siteId, ...updateValues })
        .onConflictDoUpdate({
          target: contactPages.siteId,
          set: updateValues,
        })
        .returning()
    )[0];

    return {
      heading: resultRecord.heading,
      fields: resultRecord.fieldsJson,
      submitLabel: resultRecord.submitLabel,
      successMessage: resultRecord.successMessage,
    };
  },
};
