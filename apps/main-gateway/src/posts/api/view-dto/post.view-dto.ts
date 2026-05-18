import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../domain/post.entity';
import { User } from '../../../user-accounts/users/domain/user.entity';
import { PostImage } from '../../domain/post-image.entity';

export class PostViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: 'Creator of the post',
  })
  username: string;

  @ApiProperty({
    description: 'Description of the post',
  })
  description: string;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.png',
    ],
    description: 'Array of URLs of images',
    type: [String],
  })
  imageUrl: string[];

  @ApiProperty({
    description: 'Creation date',
  })
  createdAt: Date;

  static mapToView(
    post: Post & { author: User } & { images: PostImage[] },
  ): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post.id;
    dto.username = post.author.userName;
    dto.description = post.description;
    dto.imageUrl = post.images.map((image) => image.url);
    dto.createdAt = post.createdAt;

    return dto;
  }
}
