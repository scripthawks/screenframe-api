import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationParams {
  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: 'integer',
    format: 'int32',
    description: 'pageNumber is number of portions that should be returned',
    default: 1,
  })
  @IsOptional()
  pageNumber: number = 1;

  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: 'integer',
    format: 'int32',
    description: 'pageSize is portions size that should be returned',
    default: 10,
  })
  @IsOptional()
  pageSize: number = 10;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export abstract class BaseQueryParamsInputDto<T> extends PaginationParams {
  @ApiProperty({
    required: false,
    type: String,
    default: 'createdAt',
  })
  @IsOptional()
  abstract sortBy: T;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Default value: DESC',
    enum: SortDirection,
  })
  @IsOptional()
  sortDirection: SortDirection = SortDirection.DESC;
}
