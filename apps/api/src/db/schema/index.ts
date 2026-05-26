import { relations } from 'drizzle-orm';
import { sites } from './sites';
import { landingPages } from './landing-pages';
import { productPages } from './product-pages';
import { contactPages } from './contact-pages';
import { trackOrderPages } from './track-order-pages';
import { footerConfigs } from './footer-configs';
import { media } from './media';
import { users } from './users';

export * from './users';
export * from './sites';
export * from './landing-pages';
export * from './product-pages';
export * from './contact-pages';
export * from './track-order-pages';
export * from './footer-configs';
export * from './media';

// Relations
export const sitesRelations = relations(sites, ({ one, many }) => ({
  landingPage: one(landingPages, {
    fields: [sites.id],
    references: [landingPages.siteId]
  }),
  productPage: one(productPages, {
    fields: [sites.id],
    references: [productPages.siteId]
  }),
  contactPage: one(contactPages, {
    fields: [sites.id],
    references: [contactPages.siteId]
  }),
  trackOrderPage: one(trackOrderPages, {
    fields: [sites.id],
    references: [trackOrderPages.siteId]
  }),
  footerConfig: one(footerConfigs, {
    fields: [sites.id],
    references: [footerConfigs.siteId]
  }),
  media: many(media)
}));

export const landingPagesRelations = relations(landingPages, ({ one }) => ({
  site: one(sites, {
    fields: [landingPages.siteId],
    references: [sites.id]
  })
}));

export const productPagesRelations = relations(productPages, ({ one }) => ({
  site: one(sites, {
    fields: [productPages.siteId],
    references: [sites.id]
  })
}));

export const contactPagesRelations = relations(contactPages, ({ one }) => ({
  site: one(sites, {
    fields: [contactPages.siteId],
    references: [sites.id]
  })
}));

export const trackOrderPagesRelations = relations(trackOrderPages, ({ one }) => ({
  site: one(sites, {
    fields: [trackOrderPages.siteId],
    references: [sites.id]
  })
}));

export const footerConfigsRelations = relations(footerConfigs, ({ one }) => ({
  site: one(sites, {
    fields: [footerConfigs.siteId],
    references: [sites.id]
  })
}));

export const mediaRelations = relations(media, ({ one }) => ({
  site: one(sites, {
    fields: [media.siteId],
    references: [sites.id]
  })
}));
