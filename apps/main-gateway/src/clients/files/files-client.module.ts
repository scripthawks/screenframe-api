import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { CoreModule } from '@app/core';
import { CoreConfig } from '@app/core/config';
import { FilesClientService } from './file-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'FILES_SERVICE',
        imports: [CoreModule],
        inject: [CoreConfig],
        useFactory: (coreConfig: CoreConfig) => ({
          transport: Transport.TCP,
          options: {
            host: coreConfig.FILES_SERVICE_HOST,
            port: coreConfig.FILES_SERVICE_PORT,
          },
        }),
      },
    ]),
  ],
  providers: [FilesClientService],
  exports: [FilesClientService],
})
export class FilesClientModule {}
