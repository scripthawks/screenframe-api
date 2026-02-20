import { BaseWithUuidIdEntity } from '@app/core/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/domain/user.entity';

export enum ProviderType {
  GOOGLE = 'GOOGLE',
  GIT_HUB = 'GIT_HUB',
}

@Entity()
export class Provider extends BaseWithUuidIdEntity {
  @Column({ type: 'enum', enum: ProviderType })
  type: ProviderType;

  @Column()
  providerAccountId: string;

  @ManyToOne(() => User, (user) => user.providers)
  user: User;

  @Column()
  userId: string;

  static create(data: {
    userId: string;
    providerAccountId: string;
    type: ProviderType;
  }) {
    const entity = new this();
    Object.assign(entity, data);

    return entity;
  }
}
