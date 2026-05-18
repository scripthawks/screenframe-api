import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async uploadImage(
    fileData: string,
    mimeType: string,
  ): Promise<{ publicId: string; url: string }> {
    const result = await cloudinary.uploader.upload(
      `data:${mimeType};base64,${fileData}`,
    );
    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  }
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
