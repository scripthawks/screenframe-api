import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { EmailConfirmation } from '../../users/domain/emailConfirmation.entity';
import { UNVERIFIED_USER_EXPIRY_24_HOURS } from '../constants/dto.constants';

@Injectable()
export class UserCleanupService {
  private readonly logger = new Logger(UserCleanupService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EmailConfirmation)
    private readonly emailConfirmationRepository: Repository<EmailConfirmation>,
  ) {}

  @Cron('0 2 * * *')
  async cleanupExpiredUnverifiedUsers(): Promise<void> {
    this.logger.log('Starting cleanup of expired unverified users...');

    try {
      const expiryDate = new Date(Date.now() - UNVERIFIED_USER_EXPIRY_24_HOURS);

      const expiredUsers = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.emailConfirmation', 'emailConfirmation')
        .where('user.isVerified = :isVerified', { isVerified: false })
        .andWhere('user.createdAt < :expiryDate', { expiryDate })
        .getMany();

      for (const user of expiredUsers) {
        if (user.emailConfirmation) {
          await this.emailConfirmationRepository.delete(
            user.emailConfirmation.id,
          );
        }

        await this.userRepository.delete(user.id);
      }

      this.logger.log(
        `Cleanup completed. Processed ${expiredUsers.length} users.`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Cleanup job failed: ${errorMessage}`);
    }
  }

  async manualCleanup(): Promise<void> {
    this.logger.log('Manual cleanup triggered');
    await this.cleanupExpiredUnverifiedUsers();
  }
}
