import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/domain/user.entity';
import { EmailConfirmation } from '../../../users/domain/emailConfirmation.entity';
import { UNVERIFIED_USER_EXPIRY_24_HOURS } from '../../constants/dto.constants';
import { UserAccountConfig } from '../../config/user-account.config';

@Injectable()
export class UserCleanupService {
  private readonly logger = new Logger(UserCleanupService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EmailConfirmation)
    private readonly emailConfirmationRepository: Repository<EmailConfirmation>,
    private readonly userAccountConfig: UserAccountConfig,
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
        .select(['user.id', 'emailConfirmation.id'])
        .limit(this.userAccountConfig.USER_CLEANUP_BATCH_SIZE)
        .getMany();

      if (expiredUsers.length === 0) {
        this.logger.log('No expired sessions found');
        return;
      }

      const userIds = expiredUsers.map((user) => user.id);
      const emailConfirmationIds = expiredUsers
        .filter((user) => user.emailConfirmation)
        .map((user) => user.emailConfirmation.id);

      let emailConfirmationsDeleted = 0;
      if (emailConfirmationIds.length > 0) {
        const emailDeleteResult = await this.emailConfirmationRepository
          .createQueryBuilder()
          .delete()
          .where('id IN (:...ids)', { ids: emailConfirmationIds })
          .execute();
        emailConfirmationsDeleted = emailDeleteResult.affected || 0;
      }

      const usersDeleteResult = await this.userRepository
        .createQueryBuilder()
        .delete()
        .where('id IN (:...ids)', { ids: userIds })
        .execute();

      const usersDeleted = usersDeleteResult.affected || 0;

      this.logger.log(
        `Cleanup completed. Deleted ${usersDeleted} users and ${emailConfirmationsDeleted} email confirmations in ONE query.`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Cleanup job failed: ${errorMessage}`);
    }
  }
}
