import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from '@app/core/config';

@Injectable()
export class FileConfig {
  @IsNotEmpty({ message: 'Set ENV variable CLOUDINARY_CLOUD_NAME' })
  cloudinaryCloudName: string;

  @IsNotEmpty({ message: 'Set ENV variable CLOUDINARY_API_KEY' })
  cloudinaryApiKey: string;

  @IsNotEmpty({ message: 'Set ENV variable CLOUDINARY_API_SECRET' })
  cloudinaryApiSecret: string;

  @IsNumber({}, { message: 'Set ENV variable FILES_SERVICE_PORT' })
  filesServicePort: number;

  constructor(private configService: ConfigService<any, true>) {
    this.cloudinaryCloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
    this.cloudinaryApiKey = this.configService.get('CLOUDINARY_API_KEY');
    this.cloudinaryApiSecret = this.configService.get('CLOUDINARY_API_SECRET');
    this.filesServicePort = Number(this.configService.get('PORT'));

    configValidationUtility.validateConfig(this);
  }
}
