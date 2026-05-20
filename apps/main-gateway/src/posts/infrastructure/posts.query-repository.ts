import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PostViewDto } from '../api/view-dto/post.view-dto';
import { BasePaginatedViewDto } from '@app/core/dtos';
import { GetPostsQueryParams } from '../api/input-dto/get-posts-query-params';

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

  async getAllPostsByUserId(
    userId: string,
    query: GetPostsQueryParams,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
    const [posts, totalCount] = await this.postsQueryRepository.findAndCount({
      where: { authorId: userId, deletedAt: IsNull() },
      relations: ['author', 'images'],
      skip: query.calculateSkip(),
      take: query.pageSize,
      order: {
        [query.sortBy]: query.sortDirection,
      },
    });

    return BasePaginatedViewDto.mapToView({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: posts.map((post) => PostViewDto.mapToView(post)),
    });
  }

  async getMainPagePosts(): Promise<PostViewDto[]> {
    const posts = await this.postsQueryRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['author', 'images'],
      take: 4,
    });
    return posts.map((post) => PostViewDto.mapToView(post));
  }
}
