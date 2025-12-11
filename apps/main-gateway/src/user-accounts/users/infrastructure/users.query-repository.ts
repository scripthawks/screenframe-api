import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersQRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    return await this.usersQRepository.find();
  }
}
