import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { UserRoleEnum } from '../api/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseWithUuidIdEntity } from '@app/core/entities';
import { CreateUserInputDto } from '../api/input-dto/create-user.input-dto';
import { UuidProvider } from '../../core/helpers/uuid.provider';
import { EmailConfirmation } from './emailConfirmation.entity';
import { Session } from '../../sessions/domain/session.entity';
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

  @OneToOne(
    () => EmailConfirmation,
    (emailConfirmation) => emailConfirmation.user,
    { onDelete: 'CASCADE', cascade: true },
  )
  emailConfirmation: EmailConfirmation;

  @OneToMany(() => Session, (session) => session.user, { onDelete: 'CASCADE' })
  sessions: Session[];

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

  static createWithConfirmation(
    dto: CreateUserInputDto,
    uuidProvider: UuidProvider,
    expirationTime: number,
  ) {
    const user = new this();
    user.userName = dto.userName;
    user.password = dto.password;
    user.email = dto.email;
    user.isVerified = false;
    user.isActive = true;
    user.role = UserRoleEnum.USER;
    user.emailConfirmation = EmailConfirmation.create(
      uuidProvider,
      expirationTime,
    );
    return user;
  }

  update(data: Partial<User>) {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  confirm(): User {
    this.isVerified = true;
    this.updatedAt = new Date();
    return this;
  }
}
