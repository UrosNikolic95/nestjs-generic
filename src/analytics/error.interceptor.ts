import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, async, catchError, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { ErrorEntity } from './entities/error.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(ErrorEntity)
    readonly errorRepo: Repository<ErrorEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      catchError((err) =>
        throwError(async () => {
          await this.errorRepo
            .create({
              method: req?.method,
              path: req?.route?.path,
              message: err?.message,
              stack: err?.stack,
              query: req?.query,
              body: req?.body,
              params: req?.params,
            })
            .save();
          return err;
        }),
      ),
    );
  }
}
