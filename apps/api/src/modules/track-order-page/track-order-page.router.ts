import { Router } from 'express';
import { trackOrderPageController } from './track-order-page.controller';
import { catchAsync } from '../../utils/catch-async';

const router = Router({ mergeParams: true });

router.get('/', catchAsync(trackOrderPageController.getConfig));
router.put('/', catchAsync(trackOrderPageController.upsertConfig));

export default router;
