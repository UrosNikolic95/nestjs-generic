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
import { formatValue, formatValueArray } from './analytics.helpers';

@Injectable()
export class EndpointTimeInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(EndpointTimeEntity)
    readonly endpointTimeRepo: Repository<EndpointTimeEntity>,
  ) {}

  data: { [key: string]: EndpointTimeEntity } = {};

  @Cron(CronExpression.EVERY_10_SECONDS)
  async saveData() {
    const values = Object.values(this.data);
    if (values.length) {
      values.forEach((val) => val.time.setSeconds(0, 0));
      await this.endpointTimeRepo
        .query(`insert into endpoint_time (method,path,milliseconds,calls,time)
        values ${formatValueArray(values)}
        ON conflict (method,path,time) 
        DO UPDATE SET 
        milliseconds = endpoint_time.milliseconds + EXCLUDED.milliseconds,
        calls = endpoint_time.calls + EXCLUDED.calls`);
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
        const key = [method, path].join();
        const data = this.data[key];
        const time = Date.now() - start.getTime();

        if (data) {
          data.milliseconds += time;
          data.calls += 1;
        } else {
          this.data[key] = this.endpointTimeRepo.create({
            method,
            path,
            milliseconds: time,
            calls: 1,
            time: new Date(),
          });
        }
      }),
    );
  }
}
