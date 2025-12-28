import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MeViewDto } from '../../auth/api/view-dto/me.view-dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersQueryRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersQueryRepository.find();
  }

  async findAuthUserById(userId: string): Promise<MeViewDto | null> {
    const foundUser = await this.usersQueryRepository.findOne({
      where: { id: userId },
    });
    if (!foundUser) {
      return null;
    }
    return MeViewDto.mapToView(foundUser);
  }
}
