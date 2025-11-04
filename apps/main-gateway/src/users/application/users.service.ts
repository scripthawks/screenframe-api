import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { User } from '../domain/user.entity';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { UserViewDto } from '../api/view-dto/user.view-dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQRepository: UsersQueryRepository,
  ) {}

  async create(cmd: CreateUserDto): Promise<UserViewDto> {
    // return 'This action adds a new user';
    if (!cmd.login || !cmd.email || !cmd.passwordHash) {
      throw new Error(
        'Missing required fields: user_name, email, password_hash',
      );
    }
    const user = User.create(cmd);
    return await this.usersRepository.create(user);
  }

  async findAll() {
    // return `This action returns all users`;
    return await this.usersQRepository.findAll();
  }
}
