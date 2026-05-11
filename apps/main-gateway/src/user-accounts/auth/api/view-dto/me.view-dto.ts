import { User } from '../../../users/domain/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MeViewDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;
  @ApiProperty({ example: 'John Doe' })
  userName: string;
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;
  @ApiProperty({ example: true })
  isActive: boolean;

  static mapToView(user: User): MeViewDto {
    const model = new MeViewDto();
    model.userId = user.id;
    model.userName = user.userName;
    model.email = user.email;
    model.isActive = user.isActive;
    return model;
  }
}
