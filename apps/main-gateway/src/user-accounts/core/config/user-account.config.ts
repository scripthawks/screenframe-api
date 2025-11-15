import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserAccountConfig {
  constructor(private configService: ConfigService) {}
}
