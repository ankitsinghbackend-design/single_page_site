import { Request, Response } from 'express';
import { sitesService } from './sites.service';
import { CreateSiteSchema, UpdateSiteSchema } from '@corevita/shared';

export const sitesController = {
  create: async (req: Request, res: Response) => {
    const validatedData = CreateSiteSchema.parse(req.body);
    const site = await sitesService.createSite(validatedData);
    res.status(201).json({ success: true, data: site });
  },

  list: async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string || '1', 10);
    const pageSize = parseInt(req.query.pageSize as string || '20', 10);
    
    const result = await sitesService.listSites(page, pageSize);
    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
      statusCounts: result.statusCounts
    });
  },

  getById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const site = await sitesService.getSiteById(id);
    res.json({ success: true, data: site });
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const validatedData = UpdateSiteSchema.parse(req.body);
    const site = await sitesService.updateSite(id, validatedData);
    res.json({ success: true, data: site });
  },

  delete: async (req: Request, res: Response) => {
    const { id } = req.params;
    await sitesService.deleteSite(id);
    res.json({ success: true, message: 'Site deleted successfully' });
  },
};
