import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../../../sessions/domain/session.entity';
import { Repository } from 'typeorm';
import { UserAccountConfig } from '../../config/user-account.config';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly userAccountConfig: UserAccountConfig,
  ) {}

  @Cron('0 3 * * *')
  async cleanupExpiredSessions(): Promise<void> {
    this.logger.log('Starting scheduled cleanup of expired sessions...');

    try {
      const expiredSessions = await this.sessionRepository
        .createQueryBuilder('session')
        .withDeleted()
        .where('session.expiresAt < :now', { now: new Date() })
        .orWhere('session.deletedAt IS NOT NULL')
        .select('session.id')
        .limit(this.userAccountConfig.SESSION_CLEANUP_BATCH_SIZE)
        .getMany();

      if (expiredSessions.length === 0) {
        this.logger.log('No expired sessions found');
        return;
      }

      const ids = expiredSessions.map((s) => s.id);

      const deleteResult = await this.sessionRepository
        .createQueryBuilder()
        .delete()
        .where('id IN (:...ids)', { ids })
        .execute();

      this.logger.log(
        `Session cleanup completed. Deleted ${deleteResult.affected} sessions in ONE query.`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Session cleanup job failed: ${errorMessage}`);
    }
  }
}
