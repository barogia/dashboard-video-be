import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  logger = new Logger(LoggingInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const currentClass = context.getClass().name;
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.debug(
            `${currentClass}- url :${request.url} - ${request.method} - took ${
              Date.now() - now
            }ms`,
          ),
        ),
      );
  }
}
