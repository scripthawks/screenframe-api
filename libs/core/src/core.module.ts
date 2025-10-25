import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreConfig, envFilePaths } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: envFilePaths, isGlobal: true }),
  ],
  providers: [CoreConfig],
  exports: [CoreConfig],
})
export class CoreModule {}
