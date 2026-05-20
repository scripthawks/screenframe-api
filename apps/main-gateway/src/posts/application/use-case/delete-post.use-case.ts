import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

export class DeletePostCommand {
  constructor(
    public id: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({ id, userId }: DeletePostCommand) {
    const post = await this.postsRepository.findOne(id);
    if (!post) {
      throw new BadRequestException('Post not found or deleted');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }

    await this.postsRepository.makeSoftDelete(id);
  }
}
