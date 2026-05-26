import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { sites } from "./sites";

export const landingPages = pgTable("landing_pages", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  siteId: text("site_id")
    .references(() => sites.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  announcementBarJson: jsonb("announcement_bar_json"),
  heroJson: jsonb("hero_json"),
  statsJson: jsonb("stats_json"),
  reviewsHeading: text("reviews_heading"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
