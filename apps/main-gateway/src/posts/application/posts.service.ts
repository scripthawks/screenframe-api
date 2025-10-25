import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../domain/dto/create-post.dto';

@Injectable()
export class PostsService {
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all posts`;
  }
}
