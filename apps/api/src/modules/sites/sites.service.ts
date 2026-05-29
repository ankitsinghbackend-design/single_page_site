import { db } from '../../config/db';
import { sites, landingPages, productPages, contactPages, trackOrderPages, footerConfigs, media } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';
import { deleteAsset } from '../../utils/cloudinary.utils';
import { CreateSiteType, UpdateSiteType } from '@corevita/shared';

export const sitesService = {
  async createSite(data: CreateSiteType) {
    // Check if slug is already taken
    const existing = await db.query.sites.findFirst({
      where: eq(sites.slug, data.slug)
    });
    if (existing) {
      throw new Error(`Slug '${data.slug}' is already taken`);
    }

    const [newSite] = await db.insert(sites).values({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      status: data.status,
    }).returning();

    // Insert default empty configurations for all modules
    await db.insert(landingPages).values({
      siteId: newSite.id,
      announcementBarJson: null,
      heroJson: null,
      statsJson: null,
      reviewsHeading: null
    });

    await db.insert(productPages).values({
      siteId: newSite.id,
      productName: null,
      price: null,
      originalPrice: null,
      stockBadge: null,
      descriptionJson: null,
      benefitsJson: null,
      pricingOptionsJson: null,
      autoRefillEnabled: false,
      autoRefillLabel: null,
      whyModernFoodJson: null,
      naturesGoldJson: null,
      videoTestimonialsJson: null,
      textReviewsJson: null,
      testimonialSectionHeading: null
    });

    await db.insert(contactPages).values({
      siteId: newSite.id,
      heading: null,
      submitLabel: null,
      successMessage: null,
      fieldsJson: null
    });

    await db.insert(trackOrderPages).values({
      siteId: newSite.id,
      heading: null,
      subheading: null,
      trackingProviderUrl: null,
      supportEmail: null
    });

    await db.insert(footerConfigs).values({
      siteId: newSite.id,
      footerJson: null
    });

    return newSite;
  },

  async listSites(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;

    // Fetch paginated sites
    const items = await db.query.sites.findMany({
      limit: pageSize,
      offset: offset,
      orderBy: (sites, { desc }) => [desc(sites.createdAt)],
    });

    // Count total sites
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(sites);
    const total = Number(countResult[0]?.count || 0);

    // Group count by status
    const statusCountsResult = await db
      .select({
        status: sites.status,
        count: sql<number>`count(*)`
      })
      .from(sites)
      .groupBy(sites.status);

    const statusCounts = {
      draft: 0,
      published: 0,
      archived: 0,
    } as Record<string, number>;

    statusCountsResult.forEach((row) => {
      statusCounts[row.status] = Number(row.count);
    });

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      statusCounts,
    };
  },

  async getSiteById(id: string) {
    const site = await db.query.sites.findFirst({
      where: eq(sites.id, id),
      with: {
        landingPage: true,
        productPage: true,
        contactPage: true,
        trackOrderPage: true,
        footerConfig: true,
      },
    });

    if (!site) {
      const error = new Error('Site not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return site;
  },

  async updateSite(id: string, data: UpdateSiteType) {
    // If slug is being updated, verify it's not taken by another site
    if (data.slug) {
      const existing = await db.query.sites.findFirst({
        where: eq(sites.slug, data.slug),
      });
      if (existing && existing.id !== id) {
        throw new Error(`Slug '${data.slug}' is already taken`);
      }
    }

    const [updatedSite] = await db
      .update(sites)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(sites.id, id))
      .returning();

    if (!updatedSite) {
      const error = new Error('Site not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return updatedSite;
  },

  async deleteSite(id: string) {
    // Find the site to verify existence
    const site = await db.query.sites.findFirst({
      where: eq(sites.id, id),
    });

    if (!site) {
      const error = new Error('Site not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Retrieve all media items associated with the site to clean up Cloudinary assets
    const siteMedia = await db.query.media.findMany({
      where: eq(media.siteId, id),
    });

    for (const item of siteMedia) {
      try {
        await deleteAsset(item.publicId, item.resourceType as any);
      } catch (err) {
        console.error(`Failed to delete Cloudinary asset ${item.publicId}:`, err);
      }
    }

    // Database deletion cascades to landingPages, productPages, contactPages, trackOrderPages, footerConfigs, and media
    await db.delete(sites).where(eq(sites.id, id));
    return true;
  },
};
