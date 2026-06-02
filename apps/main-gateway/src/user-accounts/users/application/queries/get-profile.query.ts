import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';
import { DomainException } from '@app/core/exceptions';
import { CommonExceptionCodes } from '@app/core/exceptions/enums';
import { ProfileViewDto } from '../../api/view-dto/profile.view-dto';

export class GetUserProfileQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileQueryHandler
  implements IQueryHandler<GetUserProfileQuery>
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  async execute(dto: GetUserProfileQuery): Promise<ProfileViewDto> {
    const user = await this.usersQueryRepository.getUserWithProfile(dto.userId);
    if (!user) {
      throw new DomainException(
        CommonExceptionCodes.NOT_FOUND,
        'User not found or delete',
      );
    }
    if (!user.profile) {
      throw new DomainException(
        CommonExceptionCodes.NOT_FOUND,
        'Profile not found or deleted',
      );
    }

    return ProfileViewDto.mapToView(user);
  }
}
