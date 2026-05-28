import { BaseQueryParamsInputDto } from '@app/core/dtos';
import { IsOptional } from 'class-validator';

enum SortByEnum {
  CreatedAt = 'createdAt',
}

export class GetPostsQueryParams extends BaseQueryParamsInputDto<SortByEnum> {
  @IsOptional()
  sortBy = SortByEnum.CreatedAt;
}
