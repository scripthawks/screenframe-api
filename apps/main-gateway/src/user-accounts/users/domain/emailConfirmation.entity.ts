import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseWithUuidIdEntity } from '@app/core/entities';
import { User } from './user.entity';
import { UuidProvider } from '../../core/helpers/uuid.provider';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { CONFIRMATION_TOKEN_LENGTH } from '../../core/constants/dto.constants';

@Entity()
export class EmailConfirmation extends BaseWithUuidIdEntity {
  @OneToOne(() => User, (user) => user.emailConfirmation)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'varchar',
    length: CONFIRMATION_TOKEN_LENGTH,
    unique: true,
  })
  confirmationToken: string;

  @Column({
    type: 'timestamp with time zone',
  })
  @Index()
  expiresAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isUsed: boolean = false;

  static create(
    uuidProvider: UuidProvider,
    expirationTime: number,
  ): EmailConfirmation {
    const confirmation = new this();
    confirmation.confirmationToken = uuidProvider.generate();
    confirmation.expiresAt = new Date(Date.now() + expirationTime);
    confirmation.isUsed = false;

    return confirmation;
  }

  update(data: Partial<EmailConfirmation>) {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  confirm(): EmailConfirmation {
    if (this.isUsed) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Confirmation token already used',
      );
    }
    if (this.expiresAt < new Date()) {
      throw new DomainException(
        CommonExceptionCodes.BAD_REQUEST,
        'Confirmation token expired',
      );
    }
    this.isUsed = true;
    this.updatedAt = new Date();
    return this;
  }
}
