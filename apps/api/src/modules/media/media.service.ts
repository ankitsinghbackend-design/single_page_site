import { db } from '../../config/db';
import { media } from '../../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { uploadBuffer, deleteAsset, getSignedUploadUrl } from '../../utils/cloudinary.utils';

export const mediaService = {
  async uploadMedia(
    file: Express.Multer.File,
    options: {
      siteId?: string;
      folder: string;
      altText?: string;
      tags?: string[];
    }
  ) {
    const rootFolder = `corevita/${options.siteId ?? "global"}/${options.folder}`;
    
    const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';

    const result = await uploadBuffer(file.buffer, {
      folder: rootFolder,
      resource_type: resourceType,
    });

    const [newMedia] = await db.insert(media).values({
      siteId: options.siteId ?? null,
      publicId: result.public_id,
      url: result.secure_url,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration ? result.duration.toString() : null,
      folder: result.folder,
      altText: options.altText,
      tags: options.tags,
    }).returning();

    return newMedia;
  },

  async deleteMedia(id: string) {
    const record = await db.query.media.findFirst({
      where: eq(media.id, id),
    });

    if (!record) {
      throw new Error('Media not found');
    }

    await deleteAsset(record.publicId, record.resourceType as any);
    await db.delete(media).where(eq(media.id, id));
    
    return true;
  },

  async listMedia(siteId?: string, resourceType?: string, page = 1, pageSize = 20) {
    const conditions = [];
    if (siteId) {
      conditions.push(eq(media.siteId, siteId));
    }
    if (resourceType) {
      conditions.push(eq(media.resourceType, resourceType));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db.query.media.findMany({
      where: whereClause,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: [desc(media.createdAt)],
    });

    return { items, page, pageSize };
  },

  getSignedParams(folder: string, resourceType: string = 'auto') {
    return getSignedUploadUrl(folder, resourceType);
  },
};
