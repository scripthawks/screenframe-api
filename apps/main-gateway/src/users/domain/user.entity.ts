import { Column, Entity } from 'typeorm';
import { UserRoleEnum } from '../api/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseWithUuidIdEntity } from '@app/core/entities';
@Entity()
export class User extends BaseWithUuidIdEntity {
  @Column({ type: 'varchar', unique: true, collation: 'C' })
  login: string;

  @Column({ type: 'varchar', unique: true, collation: 'C' })
  email: string;

  @Column({ type: 'varchar', unique: true })
  passwordHash: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  static create(dto: CreateUserDto): User {
    const user = new User();
    user.login = dto.login;
    user.passwordHash = dto.passwordHash;
    user.email = dto.email;
    return user;
  }
}
