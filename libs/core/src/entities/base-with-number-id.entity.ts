import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './index';

export abstract class BaseWithNumberIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;
}
