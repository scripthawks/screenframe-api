import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../domain/user.entity';

export class ProfileViewDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: Date, nullable: true })
  birthDate?: Date | null;

  @ApiProperty({ type: String, nullable: true })
  country?: string | null;

  @ApiProperty({ type: String, nullable: true })
  city?: string | null;

  @ApiProperty({ type: String, nullable: true })
  about?: string | null;

  @ApiProperty({ type: String, nullable: true })
  avatarUrl?: string | null;

  @ApiProperty()
  createdAt: Date;

  static mapToView(user: User): ProfileViewDto {
    const dto = new ProfileViewDto();

    dto.userId = user.id;
    dto.userName = user.userName;
    dto.createdAt = user.createdAt;

    if (user.profile) {
      dto.firstName = user.profile.firstName;
      dto.lastName = user.profile.lastName;
      dto.birthDate = user.profile.birthDate;
      dto.country = user.profile.country;
      dto.city = user.profile.city;
      dto.about = user.profile.about;
      dto.avatarUrl = user.profile.avatarUrl;
    }

    return dto;
  }
}
