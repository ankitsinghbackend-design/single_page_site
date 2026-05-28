import { Request, Response } from 'express';
import { productPageService } from './product-page.service';

export const productPageController = {
  getConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await productPageService.getConfig(siteId);
    res.json({ success: true, data: config });
  },

  upsertConfig: async (req: Request, res: Response) => {
    const { siteId } = req.params;
    const config = await productPageService.upsertConfig(siteId, req.body);
    res.json({ success: true, data: config });
  },
};
