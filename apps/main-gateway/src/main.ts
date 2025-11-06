import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { Transport } from '@nestjs/microservices';
import { coreSetup } from '@app/core/setup';
import { CoreConfig } from '@app/core/config';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  const coreConfig = app.get<CoreConfig>(CoreConfig);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });
  coreSetup(app, coreConfig);
  const port = coreConfig.PORT;
  await app.startAllMicroservices();
  console.log('Microservice started');
  await app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
bootstrap();
