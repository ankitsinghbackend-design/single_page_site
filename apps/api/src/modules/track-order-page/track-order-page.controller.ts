import { Request, Response } from 'express';
import { trackOrderPageService } from './track-order-page.service';

export const trackOrderPageController = {
  getConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await trackOrderPageService.getConfig(siteId);
    res.json({ success: true, data: config });
  },

  upsertConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await trackOrderPageService.upsertConfig(siteId, req.body);
    res.json({ success: true, data: config });
  },
};
