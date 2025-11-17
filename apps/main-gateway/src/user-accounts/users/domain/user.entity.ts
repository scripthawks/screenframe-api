import { Column, Entity } from 'typeorm';
import { UserRoleEnum } from '../api/enums/user-role.enum';
import { CreateUserDto } from './dto/user/create-user.dto';
import { BaseWithUuidIdEntity } from '@app/core/entities';
import { CreateUserInputDto } from '../api/input-dto/create-user.input-dto';
import { UuidProvider } from '../../core/helpers/uuid.provider';
@Entity()
export class User extends BaseWithUuidIdEntity {
  @Column({ type: 'varchar', unique: true, collation: 'C' })
  userName: string;

  @Column({ type: 'varchar', unique: true, collation: 'C' })
  email: string;

  @Column({ type: 'varchar', unique: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean = false;

  @Column({ type: 'boolean', default: true })
  isActive: boolean = true;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  static create(dto: CreateUserDto): User {
    const user = new User();
    user.userName = dto.userName;
    user.password = dto.password;
    user.email = dto.email;
    user.isVerified = true;
    user.isActive = true;
    user.role = UserRoleEnum.USER;
    return user;
  }

  update(data: Partial<User>) {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }
}
