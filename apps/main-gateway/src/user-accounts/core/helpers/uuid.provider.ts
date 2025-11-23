// C:\Users\polin\Documents\GitHub\quiz-game\src\core\helpers\uuid.provider.ts

import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UuidProvider {
  generate(): string {
    return randomUUID();
  }
}
