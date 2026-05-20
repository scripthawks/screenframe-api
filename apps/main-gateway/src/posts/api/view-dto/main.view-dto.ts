import { ApiProperty } from '@nestjs/swagger';
import { PostViewDto } from './post.view-dto';

export class MainPagePostsViewDto {
  @ApiProperty({ type: () => [PostViewDto] })
  posts: PostViewDto[];

  @ApiProperty()
  totalUsersCount: number;
}
