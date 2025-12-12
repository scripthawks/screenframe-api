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
}
