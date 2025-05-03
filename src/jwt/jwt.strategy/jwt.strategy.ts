import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MyConfigService } from 'src/config/my-config.service';
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
  constructor(myConfigService: MyConfigService) {
    const accessSecret = myConfigService.getJwtSecret();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessSecret,
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: JwtPayload): Promise<FullUserDto> {
    if (!payload.user) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return payload.user;
  }
}
