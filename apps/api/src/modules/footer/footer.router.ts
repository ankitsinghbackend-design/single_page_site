import { Router } from 'express';
import { footerController } from './footer.controller';
import { catchAsync } from '../../utils/catch-async';

const router = Router({ mergeParams: true });

router.get('/', catchAsync(footerController.getConfig));
router.put('/', catchAsync(footerController.upsertConfig));

export default router;
