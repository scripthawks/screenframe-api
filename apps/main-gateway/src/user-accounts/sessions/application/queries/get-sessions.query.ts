import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionsViewDto } from '../../api/view-dto/sessions.view-dto';
import { SessionsQueryRepository } from '../../infrastructure/sessions.query-repository';

export class GetSessionsQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetSessionsQuery)
export class GetSessionsQueryHandler
  implements IQueryHandler<GetSessionsQuery, SessionsViewDto[]>
{
  constructor(
    private securityDevicesQueryRepository: SessionsQueryRepository,
  ) {}
  async execute(query: GetSessionsQuery): Promise<SessionsViewDto[]> {
    return this.securityDevicesQueryRepository.getAll(query.userId);
  }
}
