import { NestFactory } from '@nestjs/core';
import { FilesModule } from './files.module';
import { Transport } from '@nestjs/microservices';
import { FileConfig } from './config/file.config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(FilesModule);
  const fileConfig = appContext.get<FileConfig>(FileConfig);
  await appContext.close();

  const app = await NestFactory.createMicroservice(FilesModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: fileConfig.filesServicePort,
    },
  });
  await app.listen();
}
bootstrap();
