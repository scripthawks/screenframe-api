import { Injectable } from '@nestjs/common';
import { Session } from '../../users/domain/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async save(session: Session) {
    await this.sessionRepository.save(session);
  }

  async update(sessionId: string, updatedAt: Date) {
    await this.sessionRepository.update({ id: sessionId }, { updatedAt });
  }

  async deleteOldestUserSession(userId: string): Promise<Session | null> {
    const oldestSession = await this.sessionRepository.findOne({
      where: {
        userId,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    if (!oldestSession) {
      return null;
    }

    await this.sessionRepository.delete(oldestSession.id);
    return oldestSession;
  }

  async findByUserAndSessionId(
    userId: string,
    sessionId: string,
  ): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        userId,
        id: sessionId,
        isActive: true,
      },
    });
  }

  async countUserSessions(userId: string): Promise<number> {
    return this.sessionRepository.count({
      where: {
        userId,
      },
    });
  }
}
