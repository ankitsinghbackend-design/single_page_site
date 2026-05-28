import { Request, Response } from 'express';
import { landingPageService } from './landing-page.service';

export const landingPageController = {
  getConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await landingPageService.getConfig(siteId);
    res.json({ success: true, data: config });
  },

  upsertConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await landingPageService.upsertConfig(siteId, req.body);
    res.json({ success: true, data: config });
  },
};
