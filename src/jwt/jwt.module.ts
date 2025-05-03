import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { JwtAccessGuard } from './jwt.guard/jwt.guard';
import { ConfigService } from '@nestjs/config';
import { MyConfigService } from '../config/my-config.service';

@Module({
  providers: [JwtStrategy, JwtAccessGuard, ConfigService, MyConfigService],
  exports: [JwtAccessGuard],
})
export class JwtModule {}
