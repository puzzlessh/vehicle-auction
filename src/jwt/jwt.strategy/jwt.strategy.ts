import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { FullUserDto } from 'src/users/dto/full-user.dto';

interface JwtPayload {
  user: FullUserDto;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'access-jwt-strategy',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('accessSecret') as string,
    });
  }

  async validate(payload: JwtPayload): Promise<FullUserDto> {
    if (!payload.user) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return payload.user;
  }
}
