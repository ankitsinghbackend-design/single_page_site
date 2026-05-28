import { Router } from 'express';
import { contactPageController } from './contact-page.controller';
import { catchAsync } from '../../utils/catch-async';

const router = Router({ mergeParams: true });

router.get('/', catchAsync(contactPageController.getConfig));
router.put('/', catchAsync(contactPageController.upsertConfig));

export default router;
