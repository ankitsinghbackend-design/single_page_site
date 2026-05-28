import { Request, Response } from 'express';
import { footerService } from './footer.service';

export const footerController = {
  getConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await footerService.getConfig(siteId);
    res.json({ success: true, data: config });
  },

  upsertConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await footerService.upsertConfig(siteId, req.body);
    res.json({ success: true, data: config });
  },
};
