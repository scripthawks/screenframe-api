import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { FileConfig } from '../config/file.config';

@Injectable()
export class CloudinaryService {
  constructor(private readonly fileConfig: FileConfig) {
    cloudinary.config({
      cloud_name: this.fileConfig.cloudinaryCloudName,
      api_key: this.fileConfig.cloudinaryApiKey,
      api_secret: this.fileConfig.cloudinaryApiSecret,
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

  async deleteImages(publicIds: string[]): Promise<void> {
    await cloudinary.api.delete_resources(publicIds);
  }

  async deleteAvatar(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
