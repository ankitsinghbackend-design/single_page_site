import { pgTable, text, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { sites } from "./sites";

export const media = pgTable("media", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  siteId: text("site_id").references(() => sites.id, { onDelete: "cascade" }),
  publicId: text("public_id").notNull(),
  url: text("url").notNull(),
  resourceType: text("resource_type"),
  format: text("format"),
  bytes: integer("bytes"),
  width: integer("width"),
  height: integer("height"),
  duration: numeric("duration"),
  folder: text("folder"),
  altText: text("alt_text"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
