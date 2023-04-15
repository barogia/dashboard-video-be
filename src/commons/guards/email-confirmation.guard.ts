import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithUser } from 'commons/types';
import { Observable } from 'rxjs';

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const { user } = request;

    if (user.isEmailConfirmed) return true;
    throw new UnauthorizedException('Confirm your email first');
  }
}
