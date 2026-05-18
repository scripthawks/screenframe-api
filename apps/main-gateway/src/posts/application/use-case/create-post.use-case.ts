import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BadRequestException } from '@nestjs/common';
import { FilesClientService } from '../../../clients/files/file-client.service';
import { PostImage } from '../../domain/post-image.entity';
import { UsersRepository } from 'apps/main-gateway/src/user-accounts/users/infrastructure/users.repository';
import { Post } from '../../domain/post.entity';

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

    // TODO: Move TO JWT Guard
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found or deleted');
    }

    const allowedTypes = ['image/jpeg', 'image/png'];

    const hasInvalidType = files.some(
      (file) => !allowedTypes.includes(file.mimetype),
    );
    if (hasInvalidType) throw new BadRequestException('Invalid file type');

    const imageUrls = await this.filesClientService.sendImages(files);

    const post = Post.create({
      description,
      author: user,
    });

    post.images = imageUrls.map((image) =>
      PostImage.create({ post, publicId: image.publicId, url: image.url }),
    );

    await this.postsRepository.save(post);

    return post.id;
  }
}
