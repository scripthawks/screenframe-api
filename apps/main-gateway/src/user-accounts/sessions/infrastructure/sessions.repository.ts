import { Injectable } from '@nestjs/common';
import { Session } from '../domain/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
  ) {}

  async save(session: Session) {
    await this.sessionsRepository.save(session);
  }

  async update(sessionId: string, updatedAt: Date) {
    await this.sessionsRepository.update({ id: sessionId }, { updatedAt });
  }

  async updateLastActivity(sessionId: string): Promise<void> {
    await this.sessionsRepository.update(
      { id: sessionId },
      { lastActive: new Date() },
    );
  }

  async deactivateOldestUserSession(userId: string): Promise<Session | null> {
    const oldestSession = await this.sessionsRepository.findOne({
      where: { userId, isActive: true },
      order: { createdAt: 'ASC' },
    });

    if (!oldestSession) return null;

    oldestSession.deactivate();

    await this.sessionsRepository.save(oldestSession);
    return oldestSession;
  }

  async deactivate(session: Session) {
    session.deactivate();
    await this.sessionsRepository.save(session);
    return true;
  }

  async deleteById(session: Session) {
    const result = await this.sessionsRepository.softRemove(session);
    if (!result) return null;
    return true;
  }

  async deleteExcludingCurrent(
    currentUserId: string,
    currentSessionId: string,
  ) {
    const devicesToDelete = await this.sessionsRepository.find({
      where: { userId: currentUserId, id: Not(currentSessionId) },
    });
    const result = await this.sessionsRepository.softRemove(devicesToDelete);
    if (!result) return null;
    return true;
  }

  async findByUserAndSessionId(
    userId: string,
    sessionId: string,
  ): Promise<Session | null> {
    return this.sessionsRepository.findOne({
      where: {
        userId,
        id: sessionId,
        isActive: true,
      },
    });
  }
  async findById(sessionId: string) {
    return await this.sessionsRepository.findOne({
      where: { id: sessionId },
      relations: { user: true },
    });
  }

  async countUserSessions(userId: string): Promise<number> {
    return this.sessionsRepository.count({
      where: {
        userId,
      },
    });
  }
}
