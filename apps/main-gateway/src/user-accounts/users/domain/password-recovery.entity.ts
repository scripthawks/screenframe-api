import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseWithUuidIdEntity } from '@app/core/entities';
import { User } from './user.entity';
import { UuidProvider } from '../../core/helpers/uuid.provider';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { PASSWORD_RECOVERY_TOKEN_EXPIRY } from '../../core/constants/dto.constants';

@Entity({ name: 'password_recovery' })
export class PasswordRecovery extends BaseWithUuidIdEntity {
  @OneToOne(() => User, (user) => user.passwordRecovery)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'uuid',
  })
  recoveryToken: string;

  @Column({
    type: 'timestamp with time zone',
  })
  expiresAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isUsed: boolean = false;

  static create(userId: string, uuidProvider: UuidProvider): PasswordRecovery {
    const recovery = new this();
    recovery.userId = userId;
    recovery.recoveryToken = uuidProvider.generate();
    recovery.expiresAt = new Date(Date.now() + PASSWORD_RECOVERY_TOKEN_EXPIRY);
    recovery.isUsed = false;
    return recovery;
  }

  update(data: Partial<PasswordRecovery>) {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  renewToken(uuidProvider: UuidProvider): PasswordRecovery {
    this.recoveryToken = uuidProvider.generate();
    this.expiresAt = new Date(Date.now() + PASSWORD_RECOVERY_TOKEN_EXPIRY);
    this.isUsed = false;
    this.updatedAt = new Date();
    return this;
  }

  confirm(): PasswordRecovery {
    if (this.isUsed) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Password recovery token already used',
      );
    }
    if (this.expiresAt < new Date()) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Password recovery token expired',
      );
    }
    this.isUsed = true;
    this.updatedAt = new Date();
    return this;
  }
}
