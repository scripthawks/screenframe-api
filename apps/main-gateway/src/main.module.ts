import { Module } from '@nestjs/common';
import { CoreModule } from '@app/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeormOptions } from './core/db/typeorm/typeorm-options';
import { UserAccountsModule } from './user-accounts/user-accounts.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => {
        return {
          ...typeormOptions,
          autoLoadEntities: true,
        };
      },
    }),
    UserAccountsModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
