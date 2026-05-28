import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

export class UpdatePostCommand {
  constructor(
    public id: string,
    public description: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({ id, description, userId }: UpdatePostCommand) {
    const post = await this.postsRepository.findOne(id);
    if (!post) {
      throw new BadRequestException('Post not found or deleted');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }

    post.update({ description });

    await this.postsRepository.save(post);

    return post.id;
  }
}
