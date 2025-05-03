import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
  constructor(private configService: ConfigService) {}

  getJwtSecret(): string {
    const secret = this.configService.get<string>('ACCESS_SECRET');
    if (!secret) {
      throw new Error('ACCESS_SECRET is not defined');
    }
    return secret;
  }
}
