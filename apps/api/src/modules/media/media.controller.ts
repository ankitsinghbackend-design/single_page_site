import { Request, Response } from 'express';
import { mediaService } from './media.service';

export const mediaController = {
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const { siteId, folder, altText, tags } = req.body;
      const parsedTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : undefined;
      
      const newMedia = await mediaService.uploadMedia(req.file, {
        siteId,
        folder: folder || 'general',
        altText,
        tags: parsedTags,
      });

      res.json({ success: true, data: newMedia });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await mediaService.deleteMedia(id);
      res.json({ success: true, message: 'Media deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const { siteId, type, page, pageSize } = req.query;
      const parsedPage = page ? parseInt(page as string, 10) : 1;
      const parsedPageSize = pageSize ? parseInt(pageSize as string, 10) : 20;
      
      const data = await mediaService.listMedia(
        siteId as string,
        type as string,
        parsedPage,
        parsedPageSize
      );

      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async sign(req: Request, res: Response) {
    try {
      const { folder, type } = req.query;
      const data = mediaService.getSignedParams(
        folder ? (folder as string) : 'uploads',
        type ? (type as string) : 'auto'
      );
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
