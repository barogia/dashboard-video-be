import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthenGuard extends AuthGuard('jwt-refresh-token') {}
