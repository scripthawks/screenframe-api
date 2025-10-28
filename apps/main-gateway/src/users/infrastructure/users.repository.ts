import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserViewDto } from '../api/view-dto/user.view-dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async create(user: User): Promise<UserViewDto> {
    return await this.dataSource.manager.save(User, user);
  }
}
