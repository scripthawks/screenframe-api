import { BaseWithUuidIdEntity } from '@app/core/entities';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { CreateProfileDto } from '../application/dto/create-profile.dto';
import { UpdateProfileDto } from '../application/dto/update-profile.dto';

@Entity()
export class Profile extends BaseWithUuidIdEntity {
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarPublicId: string | null;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'varchar', nullable: true })
  country: string | null;

  @Column({ type: 'varchar', nullable: true })
  city: string | null;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  about: string | null;

  static create(dto: CreateProfileDto, user: User): Profile {
    const profile = new this();
    profile.user = user;
    profile.firstName = dto.firstName;
    profile.lastName = dto.lastName;
    profile.birthDate = dto.birthDate ?? null;
    profile.country = dto.country ?? null;
    profile.city = dto.city ?? null;
    profile.about = dto.about ?? null;
    return profile;
  }

  update(dto: UpdateProfileDto): void {
    Object.assign(this, dto);
  }

  updateAvatar(avatarUrl: string, avatarPublicId: string): void {
    this.avatarUrl = avatarUrl;
    this.avatarPublicId = avatarPublicId;
  }
}
