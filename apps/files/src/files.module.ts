import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { CloudinaryService } from './adapter/cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { envFileBasePaths } from '@app/core/config';
import { FileConfig } from './config/file.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFileBasePaths(__dirname),
      isGlobal: true,
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, CloudinaryService, FileConfig],
})
export class FilesModule {}
