import { Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { request } from 'http';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/modules/authen/interfaces/authen.interface';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.headers.authorization.split(' ')[1];

    return await this.userService.getUserFromRefreshToken(
      refreshToken,
      payload.userId,
    );
  }
}
