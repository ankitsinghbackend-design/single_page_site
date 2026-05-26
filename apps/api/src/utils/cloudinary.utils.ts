import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export const initCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const uploadBuffer = (
  buffer: Buffer,
  options: { folder: string; resource_type: "image" | "video" | "raw" | "auto"; public_id?: string }
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error('Cloudinary returned no result'));
      resolve(result);
    });
    uploadStream.end(buffer);
  });
};

export const deleteAsset = async (publicId: string, resourceType: "image" | "video" | "raw" = "image") => {
  return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export const getSignedUploadUrl = (folder: string, resource_type: string = 'auto') => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  };
};
