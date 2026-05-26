import { z } from 'zod';

export const SiteStatus = z.enum(["draft", "published", "archived"]);

export const CreateSiteSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().optional(),
  status: SiteStatus,
});

export const UpdateSiteSchema = CreateSiteSchema.partial();

export type SiteStatusType = z.infer<typeof SiteStatus>;
export type CreateSiteType = z.infer<typeof CreateSiteSchema>;
export type UpdateSiteType = z.infer<typeof UpdateSiteSchema>;
