import { Entity, Column, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { BaseWithUuidIdEntity } from '@app/core/entities';

@Entity('post_images')
export class PostImage extends BaseWithUuidIdEntity {
  @ManyToOne(() => Post, (post) => post.images, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @Column()
  fileId: string;

  @Column()
  url: string;

  static create(dto: { post: Post; publicId: string; url: string }): PostImage {
    const postImage = new this();
    postImage.post = dto.post;
    postImage.fileId = dto.publicId;
    postImage.url = dto.url;
    return postImage;
  }
}
