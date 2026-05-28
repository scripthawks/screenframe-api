import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Post } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async save(post: Post): Promise<Post> {
    return await this.postsRepository.save(post);
  }

  async findOne(id: string): Promise<Post | null> {
    return await this.postsRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async makeSoftDelete(id: string): Promise<void> {
    await this.postsRepository.softDelete(id);
  }
}
