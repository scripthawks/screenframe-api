import { User } from '../../../users/domain/user.entity';

export class MeViewDto {
  userId: string;
  userName: string;
  email: string;
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
