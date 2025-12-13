import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../../../users/domain/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  @Cron('0 3 * * *')
  async cleanupExpiredSessions(): Promise<void> {
    this.logger.log('Starting scheduled cleanup of expired sessions...');

    try {
      const expiredSessions = await this.sessionRepository
        .createQueryBuilder('session')
        .where('session.expiresAt < :now', { now: new Date() })
        .getMany();

      for (const session of expiredSessions) {
        await this.sessionRepository.delete(session.id);
      }

      this.logger.log(
        `Session cleanup completed. Processed ${expiredSessions.length} sessions.`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Session cleanup job failed: ${errorMessage}`);
    }
  }

  async manualCleanup(): Promise<void> {
    this.logger.log('Manual session cleanup triggered');
    await this.cleanupExpiredSessions();
  }
}
