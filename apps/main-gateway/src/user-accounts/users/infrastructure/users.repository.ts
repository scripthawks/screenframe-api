import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async save(user: User) {
    await this.usersRepository.save(user);
  }

  async findByUserNameOrEmail(userName: string, email: string) {
    return await this.usersRepository.findOne({
      where: [{ userName: userName }, { email: email }],
    });
  }

  async findByConfirmationToken(
    confirmationToken: string,
  ): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { emailConfirmation: { confirmationToken: confirmationToken } },
      relations: { emailConfirmation: true },
    });
  }
}
