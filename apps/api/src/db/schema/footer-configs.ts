import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { sites } from "./sites";

export const footerConfigs = pgTable("footer_configs", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  siteId: text("site_id")
    .references(() => sites.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  footerJson: jsonb("footer_json"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
