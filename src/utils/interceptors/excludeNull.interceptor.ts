import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ExcluceNullInterceptor implements NestInterceptor {
  recursivelyStripNullValues(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map(this.recursivelyStripNullValues);
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, value]) => [
          key,
          this.recursivelyStripNullValues(value),
        ]),
      );
    }
    if (value !== null) {
      return value;
    }
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map((value) => this.recursivelyStripNullValues(value)));
  }
}
