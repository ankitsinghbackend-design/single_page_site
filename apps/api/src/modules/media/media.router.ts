import { Router } from 'express';
import { mediaController } from './media.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { uploadAny } from '../../middleware/upload.middleware';

const router = Router();

router.post('/upload', requireAuth, uploadAny, mediaController.upload);
router.delete('/:id', requireAuth, mediaController.delete);
router.get('/', requireAuth, mediaController.list);
router.get('/sign', requireAuth, mediaController.sign);

export default router;
