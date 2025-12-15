import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';

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

  async findByUserName(userName: string) {
    return await this.usersRepository.findOne({
      where: [{ userName: userName }],
    });
  }

  async findByEmail(userEmail: string) {
    return await this.usersRepository.findOne({
      where: [{ email: userEmail }],
    });
  }

  async findByEmailOrFail(email: string): Promise<User> {
    const foundUser = await this.usersRepository.findOne({
      where: { email: email },
      relations: { emailConfirmation: true },
    });
    if (!foundUser) {
      throw new RepositoryException(
        CommonExceptionCodes.BAD_REQUEST,
        'User with this email does not exist',
      );
    }
    return foundUser;
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
