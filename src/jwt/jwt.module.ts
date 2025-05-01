import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { JwtAccessGuard } from './jwt.guard/jwt.guard';
import { ConfigService } from '@nestjs/config';

@Module({})
export class JwtModule {
  providers: [JwtStrategy, JwtAccessGuard, ConfigService];
  exports: [JwtAccessGuard];
}
