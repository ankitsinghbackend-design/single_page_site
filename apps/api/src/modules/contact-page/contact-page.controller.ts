import { Request, Response } from 'express';
import { contactPageService } from './contact-page.service';

export const contactPageController = {
  getConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await contactPageService.getConfig(siteId);
    res.json({ success: true, data: config });
  },

  upsertConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await contactPageService.upsertConfig(siteId, req.body);
    res.json({ success: true, data: config });
  },
};
