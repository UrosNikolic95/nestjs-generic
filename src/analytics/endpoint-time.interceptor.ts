import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, async, catchError, tap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { EndpointTimeEntity } from './entities/endpoint-time.entity';
import { Request } from 'express';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EndpointTimeInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(EndpointTimeEntity)
    readonly endpointTimeRepo: Repository<EndpointTimeEntity>,
  ) {}

  data: EndpointTimeEntity[] = [];

  @Cron(CronExpression.EVERY_10_SECONDS)
  async saveData() {
    if (this.data.length) {
      await this.endpointTimeRepo.save(this.data);
      this.data.splice(0);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const start = new Date();
    return next.handle().pipe(
      tap(async () => {
        this.data.push(
          this.endpointTimeRepo.create({
            method: req?.method,
            path: req?.route?.path,
            milliseconds: Date.now() - start.getTime(),
            called_at: start,
          }),
        );
      }),
    );
  }
}
