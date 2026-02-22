import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../domain/session.entity';
import { SessionsViewDto } from '../api/view-dto/sessions.view-dto';

@Injectable()
export class SessionsQueryRepository {
  constructor(
    @InjectRepository(Session)
    private securityDevicesQueryRepository: Repository<Session>,
  ) {}

  async getAll(currentUser: string): Promise<SessionsViewDto[]> {
    const devices = await this.findByUserId(currentUser);
    return devices.map((device) => SessionsViewDto.mapToView(device));
  }

  async findByUserId(userId: string) {
    return await this.securityDevicesQueryRepository.find({
      where: { user: { id: userId } },
    });
  }
}
