import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { PostImage } from './post-image.entity';
import { User } from '../../user-accounts/users/domain/user.entity';
import { BaseWithUuidIdEntity } from '@app/core/entities';

export class CreatePostDto {
  description: string;
  author: User;
}

@Entity('posts')
export class Post extends BaseWithUuidIdEntity {
  @Column({ type: 'varchar', length: 500 })
  description: string;

  @ManyToOne(() => User)
  author: User;

  @OneToMany(() => PostImage, (image) => image.post, {
    cascade: true,
  })
  images: PostImage[];

  static create(dto: CreatePostDto): Post {
    const post = new this();
    post.description = dto.description;
    post.author = dto.author;
    return post;
  }
}
