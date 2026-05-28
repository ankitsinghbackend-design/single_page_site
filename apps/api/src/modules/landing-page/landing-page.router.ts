import { Router } from 'express';
import { landingPageController } from './landing-page.controller';
import { catchAsync } from '../../utils/catch-async';

const router = Router({ mergeParams: true });

router.get('/', catchAsync(landingPageController.getConfig));
router.put('/', catchAsync(landingPageController.upsertConfig));

export default router;
