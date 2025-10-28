import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '../api/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  user_name: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', unique: true })
  password_hash: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updated_at: Date | null;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Column({ type: 'varchar', nullable: true })
  avatar_url: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  static create(dto: CreateUserDto): User {
    const user = new User();
    user.user_name = dto.user_name;
    user.password_hash = dto.password_hash;
    user.email = dto.email;
    return user;
  }
}
