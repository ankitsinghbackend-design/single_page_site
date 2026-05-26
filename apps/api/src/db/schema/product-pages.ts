import { pgTable, text, timestamp, jsonb, boolean, numeric } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { sites } from "./sites";

export const productPages = pgTable("product_pages", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  siteId: text("site_id")
    .references(() => sites.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  productName: text("product_name"),
  price: numeric("price"),
  originalPrice: numeric("original_price"),
  stockBadge: text("stock_badge"),
  descriptionJson: jsonb("description_json"),
  benefitsJson: jsonb("benefits_json"),
  pricingOptionsJson: jsonb("pricing_options_json"),
  autoRefillEnabled: boolean("auto_refill_enabled").default(false),
  autoRefillLabel: text("auto_refill_label"),
  whyModernFoodJson: jsonb("why_modern_food_json"),
  naturesGoldJson: jsonb("natures_gold_json"),
  videoTestimonialsJson: jsonb("video_testimonials_json"),
  textReviewsJson: jsonb("text_reviews_json"),
  testimonialSectionHeading: text("testimonial_section_heading"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
