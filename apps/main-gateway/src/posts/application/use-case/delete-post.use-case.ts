import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DomainException } from '@app/core/exceptions/domain.exception';
import { CommonExceptionCodes } from '@app/core/exceptions/enums/common-exception-codes.enum';

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
    try {
      await this.postsRepository.makeSoftDelete(id);
      // TODO: delete images from files service?
    } catch {
      throw new DomainException(
        CommonExceptionCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete post, try again later',
      );
    }
  }
}
