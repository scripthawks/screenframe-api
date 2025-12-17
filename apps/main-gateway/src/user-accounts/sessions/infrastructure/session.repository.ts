import { Injectable } from '@nestjs/common';
import { Session } from '../domain/session.entity';
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

  async deactivateOldestUserSession(userId: string): Promise<Session | null> {
    const oldestSession = await this.sessionRepository.findOne({
      where: { userId, isActive: true },
      order: { createdAt: 'ASC' },
    });

    if (!oldestSession) return null;

    oldestSession.deactivate();

    await this.sessionRepository.save(oldestSession);
    return oldestSession;
  }

  async deactivate(session: Session) {
    session.deactivate();
    await this.sessionRepository.save(session);
    return true;
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
  async findById(sessionId: string) {
    return await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: { user: true },
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
