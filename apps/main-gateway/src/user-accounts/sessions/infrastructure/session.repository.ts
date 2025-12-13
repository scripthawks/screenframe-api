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

  async findByUserAndDeviceName(
    userId: string,
    deviceName: string,
  ): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        userId,
        deviceName,
        isActive: true,
      },
    });
  }

  async findByUserAndSessionId(
    userId: string,
    sessionId: string,
  ): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        userId,
        id: sessionId, // предполагая что у Session есть поле id
        isActive: true,
      },
    });
  }
}
