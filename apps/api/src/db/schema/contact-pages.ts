import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { sites } from "./sites";

export const contactPages = pgTable("contact_pages", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  siteId: text("site_id")
    .references(() => sites.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  heading: text("heading"),
  submitLabel: text("submit_label"),
  successMessage: text("success_message"),
  fieldsJson: jsonb("fields_json"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
