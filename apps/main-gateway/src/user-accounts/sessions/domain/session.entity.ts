import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { BaseWithUuidIdEntity } from '@app/core/entities';
import { CreateSessionDto } from './dto/create-session.dto';

@Entity()
export class Session extends BaseWithUuidIdEntity {
  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'varchar' })
  deviceName: string;

  @Column({ type: 'inet' })
  ipAddress: string;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @Column({ type: 'timestamp with time zone' })
  lastActive: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean = true;

  static create(dto: CreateSessionDto): Session {
    const session = new this();
    session.userId = dto.userId;
    session.id = dto.sessionId;
    session.deviceName = dto.deviceName;
    session.ipAddress = dto.ipAddress;
    session.expiresAt = new Date(dto.expiresAt * 1000);
    session.lastActive = new Date(dto.lastActive * 1000);
    session.isActive = true;
    return session;
  }

  update(data: Partial<Session>) {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  deactivate() {
    this.expiresAt = new Date();
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
