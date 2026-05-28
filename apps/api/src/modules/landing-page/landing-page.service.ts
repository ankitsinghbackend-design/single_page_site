import { db } from '../../config/db';
import { landingPages } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { LandingPageSchema, LandingPageType } from '@corevita/shared';

export const landingPageService = {
  async getConfig(siteId: string) {
    const record = await db.query.landingPages.findFirst({
      where: eq(landingPages.siteId, siteId),
    });

    if (!record) {
      const error = new Error('Landing page config not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return {
      announcementBar: record.announcementBarJson,
      hero: record.heroJson,
      stats: record.statsJson,
      reviewsHeading: record.reviewsHeading,
    };
  },

  async upsertConfig(siteId: string, payload: LandingPageType) {
    // Validate with Zod
    const validated = LandingPageSchema.parse(payload);

    const [updated] = await db
      .update(landingPages)
      .set({
        announcementBarJson: validated.announcementBar,
        heroJson: validated.hero,
        statsJson: validated.stats,
        reviewsHeading: validated.reviewsHeading,
        updatedAt: new Date(),
      })
      .where(eq(landingPages.siteId, siteId))
      .returning();

    if (!updated) {
      // Fallback: Perform insert/upsert if site record wasn't pre-scaffolded
      const [inserted] = await db
        .insert(landingPages)
        .values({
          siteId,
          announcementBarJson: validated.announcementBar,
          heroJson: validated.hero,
          statsJson: validated.stats,
          reviewsHeading: validated.reviewsHeading,
        })
        .onConflictDoUpdate({
          target: landingPages.siteId,
          set: {
            announcementBarJson: validated.announcementBar,
            heroJson: validated.hero,
            statsJson: validated.stats,
            reviewsHeading: validated.reviewsHeading,
            updatedAt: new Date(),
          }
        })
        .returning();

      return {
        announcementBar: inserted.announcementBarJson,
        hero: inserted.heroJson,
        stats: inserted.statsJson,
        reviewsHeading: inserted.reviewsHeading,
      };
    }

    return {
      announcementBar: updated.announcementBarJson,
      hero: updated.heroJson,
      stats: updated.statsJson,
      reviewsHeading: updated.reviewsHeading,
    };
  },
};
