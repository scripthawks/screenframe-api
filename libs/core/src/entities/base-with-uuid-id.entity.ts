import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './index';

export abstract class BaseWithUuidIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
}
