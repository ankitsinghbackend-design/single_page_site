import { Router } from 'express';
import { sitesController } from './sites.controller';
import { catchAsync } from '../../utils/catch-async';
import { requireAuth } from '../../middleware/auth.middleware';

// Import sub-routers for page types
import landingPageRouter from '../landing-page/landing-page.router';
import productPageRouter from '../product-page/product-page.router';
import contactPageRouter from '../contact-page/contact-page.router';
import trackOrderPageRouter from '../track-order-page/track-order-page.router';
import footerRouter from '../footer/footer.router';

const router = Router();

// All site routes require authentication
router.use(requireAuth);

// Site Meta CRUD
router.post('/', catchAsync(sitesController.create));
router.get('/', catchAsync(sitesController.list));
router.get('/:id', catchAsync(sitesController.getById));
router.patch('/:id', catchAsync(sitesController.update));
router.delete('/:id', catchAsync(sitesController.delete));

// Subpage configuration endpoints (nested routing)
router.use('/:siteId/landing-page', landingPageRouter);
router.use('/:siteId/product-page', productPageRouter);
router.use('/:siteId/contact-page', contactPageRouter);
router.use('/:siteId/track-order-page', trackOrderPageRouter);
router.use('/:siteId/footer', footerRouter);

export default router;
