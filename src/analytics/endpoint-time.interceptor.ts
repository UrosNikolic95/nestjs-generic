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

  data: { [key: string]: EndpointTimeEntity } = {};

  @Cron(CronExpression.EVERY_30_SECONDS)
  async saveData() {
    const values = Object.values(this.data);
    console.log('#', values.length);
    if (values.length) {
      await this.endpointTimeRepo.save(values);
      for (const key in this.data) {
        delete this.data[key];
      }
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const start = new Date();
    return next.handle().pipe(
      tap(async () => {
        const method = req?.method;
        const path = req?.route?.path;
        const data = this.data[[method, path].join()];
        const time = Date.now() - start.getTime();

        if (data) {
          data.milliseconds += time;
          data.calls += 1;
        } else {
          this.data[[method, path].join()] = this.endpointTimeRepo.create({
            method,
            path,
            milliseconds: time,
            calls: 1,
          });
        }
      }),
    );
  }
}
