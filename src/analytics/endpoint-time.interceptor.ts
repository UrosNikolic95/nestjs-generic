import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, async, catchError, tap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import {
  EndpointTimeEntity,
  endpointTimeUniq,
} from './entities/endpoint-time.entity';
import { Request } from 'express';
import { Cron, CronExpression } from '@nestjs/schedule';
import { formatValue, formatValueArray } from './analytics.helpers';
import { time_group_size } from './analytics.consts';

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
      const columns = Object.keys(values[0]);
      await this.endpointTimeRepo.query(`insert into endpoint_time (${columns})
        values ${formatValueArray(values)}
        ON conflict (${endpointTimeUniq}) 
        DO UPDATE SET 
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
        const time = Date.now() - start.getTime();
        const reminder = time % time_group_size;
        const lower_limit = time - reminder;
        start.setMinutes(0, 0, 0);
        const key = [method, path, lower_limit, start.toISOString()].join();
        const data = this.data[key];

        if (data) {
          data.calls += 1;
        } else {
          this.data[key] = this.endpointTimeRepo.create({
            method,
            path,
            lower_limit,
            calls: 1,
            time: start,
          });
        }
      }),
    );
  }
}
