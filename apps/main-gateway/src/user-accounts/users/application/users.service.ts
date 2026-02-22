import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { User } from '../domain/user.entity';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQRepository: UsersQueryRepository,
  ) {}

  async create(cmd: CreateUserDto) {
    if (!cmd.userName || !cmd.email || !cmd.password) {
      throw new Error(
        'Missing required fields: user_name, email, password_hash',
      );
    }
    const user = User.create(cmd);
    return await this.usersRepository.create(user);
  }

  async findAll() {
    return await this.usersQRepository.findAll();
  }
}
