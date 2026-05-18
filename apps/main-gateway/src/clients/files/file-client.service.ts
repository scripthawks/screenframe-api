import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FilesClientService {
  constructor(@Inject('FILES_SERVICE') private readonly client: ClientProxy) {}

  sendImages(files: Express.Multer.File[]): Promise<
    {
      publicId: string;
      url: string;
    }[]
  > {
    return firstValueFrom(
      this.client.send(
        'send_images',
        files.map((f) => ({
          fileData: f.buffer.toString('base64'),
          mimetype: f.mimetype,
        })),
      ),
    );
  }
}
