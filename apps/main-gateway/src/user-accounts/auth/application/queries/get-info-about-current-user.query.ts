import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';
import { MeViewDto } from '../../api/view-dto/me.view-dto';

export class GetInfoAboutCurrentUserQuery {
  constructor(public currentUserId: string) {}
}

@QueryHandler(GetInfoAboutCurrentUserQuery)
export class GetInfoAboutCurrentUserQueryHandler
  implements IQueryHandler<GetInfoAboutCurrentUserQuery, MeViewDto | null>
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  async execute(
    query: GetInfoAboutCurrentUserQuery,
  ): Promise<MeViewDto | null> {
    return this.usersQueryRepository.findAuthUserById(query.currentUserId);
  }
}
