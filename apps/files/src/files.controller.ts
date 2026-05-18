import { Controller } from '@nestjs/common';
import { FilesService } from './files.service';
import { MessagePattern } from '@nestjs/microservices';
import { CloudinaryService } from './adapter/cloudinary.service';
@Controller()
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @MessagePattern('send_images')
  async saveImages(
    data: Array<{ fileData: string; mimetype: string }>,
  ): Promise<Array<{ publicId: string; url: string }>> {
    return await Promise.all(
      data.map(async (f) => {
        return await this.cloudinaryService.uploadImage(f.fileData, f.mimetype);
      }),
    );
  }
}
