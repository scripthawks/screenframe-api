import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseWithUuidIdEntity } from '@app/core/entities';
import { CreateSessionDto } from './dto/session/create-session.dto';

@Entity()
export class Session extends BaseWithUuidIdEntity {
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'varchar' })
  deviceName: string;

  @Column({ type: 'inet' })
  ipAddress: string;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  static create(dto: CreateSessionDto): Session {
    const session = new this();
    session.userId = dto.userId;
    session.deviceName = dto.deviceName;
    session.ipAddress = dto.ipAddress;
    session.expiresAt = new Date(dto.expiresAt * 1000);
    session.isActive = true;
    return session;
  }

  update(data: Partial<Session>) {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }
}
