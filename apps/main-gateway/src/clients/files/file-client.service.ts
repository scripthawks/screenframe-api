import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ALLOWED_IMAGE_MIME_TYPES } from '../constants/constants';
import { ImageOutputDto } from './dto/image-output.dto';

@Injectable()
export class FilesClientService {
  private readonly logger = new Logger(FilesClientService.name);

  constructor(@Inject('FILES_SERVICE') private readonly client: ClientProxy) {}

  sendImages(files: Express.Multer.File[]): Promise<ImageOutputDto[] | null> {
    this.validateImageMimeType(files);
    return this.send<ImageOutputDto[]>(
      'send_images',
      files.map((f) => ({
        fileData: f.buffer.toString('base64'),
        mimetype: f.mimetype,
      })),
    );
  }

  sendAvatar(file: Express.Multer.File): Promise<ImageOutputDto | null> {
    this.validateImageMimeType([file]);
    return this.send<ImageOutputDto>('send_avatar', {
      fileData: file.buffer.toString('base64'),
      mimetype: file.mimetype,
    });
  }

  deleteImages(publicIds: string[]): Promise<void | null> {
    return this.send<void>('delete_images', publicIds);
  }

  deleteAvatar(publicId: string): Promise<void | null> {
    return this.send<void>('delete_avatar', publicId);
  }

  private validateImageMimeType(files: Express.Multer.File[]): void {
    const hasInvalidType = files.some(
      (file) => !ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype),
    );
    if (hasInvalidType) throw new BadRequestException('Invalid file type');
  }

  private async send<T>(pattern: string, payload: unknown): Promise<T | null> {
    try {
      return await firstValueFrom(this.client.send(pattern, payload));
    } catch (error) {
      this.logger.error(`Error sending message: ${pattern}`, error);
      return null;
    }
  }
}
