import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostViewDto } from '../api/view-dto/post.view-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postsQueryRepository: Repository<Post>,
  ) {}

  async findOne(id: string): Promise<PostViewDto | null> {
    const post = await this.postsQueryRepository.findOne({
      where: { id },
      relations: ['author', 'images'],
    });
    if (!post) return null;

    return PostViewDto.mapToView(post);
  }
}
