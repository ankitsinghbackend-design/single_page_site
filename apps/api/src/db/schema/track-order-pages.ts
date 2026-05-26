import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { sites } from "./sites";

export const trackOrderPages = pgTable("track_order_pages", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  siteId: text("site_id")
    .references(() => sites.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  heading: text("heading"),
  subheading: text("subheading"),
  trackingProviderUrl: text("tracking_provider_url"),
  supportEmail: text("support_email"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
