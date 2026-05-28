import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BadRequestException } from '@nestjs/common';
import { FilesClientService } from '../../../clients/files/file-client.service';
import { PostImage } from '../../domain/post-image.entity';
import { UsersRepository } from '../../../user-accounts/users/infrastructure/users.repository';
import { Post } from '../../domain/post.entity';
import { DomainException } from '@app/core/exceptions/domain.exception';
import { CommonExceptionCodes } from '@app/core/exceptions/enums/common-exception-codes.enum';

export class CreatePostCommand {
  constructor(
    public description: string,
    public userId: string,
    public files: Express.Multer.File[],
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly filesClientService: FilesClientService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ description, userId, files }: CreatePostCommand) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found or deleted');
    }

    const imageData = await this.filesClientService.sendImages(files);

    try {
      const post = Post.create({
        description,
        author: user,
      });

      if (imageData) {
        post.images = imageData.map((image) =>
          PostImage.create({ publicId: image.publicId, url: image.url }),
        );
      }
      await this.postsRepository.save(post);
      return post.id;
    } catch {
      if (imageData) {
        await this.filesClientService.deleteImages(
          imageData.map((image) => image.publicId),
        );
      }
      throw new DomainException(
        CommonExceptionCodes.INTERNAL_SERVER_ERROR,
        'Failed to create post, try again later',
      );
    }
  }
}
