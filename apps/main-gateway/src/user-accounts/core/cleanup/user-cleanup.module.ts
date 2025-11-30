import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCleanupService } from './user-cleanup.service';
import { User } from '../../users/domain/user.entity';
import { EmailConfirmation } from '../../users/domain/emailConfirmation.entity';
@Module({
  imports: [
    ScheduleModule.forRoot(), // Подключаем ScheduleModule
    TypeOrmModule.forFeature([User, EmailConfirmation]), // Репозитории
  ],
  providers: [UserCleanupService],
  exports: [UserCleanupService],
})
export class UserCleanupModule {}
