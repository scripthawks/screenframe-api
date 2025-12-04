import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UuidProvider {
  generate(): string {
    return randomUUID();
  }
}
