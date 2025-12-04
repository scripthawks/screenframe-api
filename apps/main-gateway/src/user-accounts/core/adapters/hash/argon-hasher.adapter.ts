import { Injectable } from '@nestjs/common';
import { hash, verify, Algorithm } from '@node-rs/argon2';

@Injectable()
export class ArgonHasher {
  async generateHash(password: string): Promise<string> {
    return await hash(password, {
      algorithm: Algorithm.Argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });
  }

  async checkPassword(password: string, hash: string): Promise<boolean> {
    return await verify(hash, password);
  }
}
