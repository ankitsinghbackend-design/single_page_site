import { Router } from 'express';
import { productPageController } from './product-page.controller';
import { catchAsync } from '../../utils/catch-async';

const router = Router({ mergeParams: true });

router.get('/', catchAsync(productPageController.getConfig));
router.put('/', catchAsync(productPageController.upsertConfig));

export default router;
