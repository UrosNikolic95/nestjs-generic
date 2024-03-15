import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EndpointTimeEntity } from './entities/endpoint-time.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { dateFrom } from './analytics.helpers';
import { ErrorEntity } from './entities/error.entity';
import { AnalyticsErrorDto } from './dtos/analytics-error.dto';
import { AnalyticsTimeDto } from './dtos/analytics-time.dto';
import { time_group_size } from './analytics.consts';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ErrorEntity)
    readonly errorRepo: Repository<ErrorEntity>,
    @InjectRepository(EndpointTimeEntity)
    readonly endpointTimeRepo: Repository<EndpointTimeEntity>,
  ) {}

  getWeekExceptions(queryReq: AnalyticsErrorDto) {
    const queryBuilder = this.errorRepo
      .createQueryBuilder('errors')
      .select([
        "date_trunc('hour',errors.created_at) as time",
        'count(*)::int as count',
      ])
      .groupBy(`date_trunc('hour',errors.created_at)`)
      .orderBy(`date_trunc('hour',errors.created_at)`, 'ASC')
      .where('errors.created_at > :date', { date: dateFrom({ days: -7 }) });

    if (queryReq?.method)
      queryBuilder.andWhere('errors.method = :method', {
        method: queryReq.method,
      });

    if (queryReq?.path)
      queryBuilder.andWhere('errors.path = :path', {
        path: queryReq.path,
      });

    return queryBuilder.getRawMany();
  }

  getWeekExceptionsPerPath() {
    console.log({
      date: dateFrom({ days: -7 }),
    });

    const queryBuilder = this.errorRepo
      .createQueryBuilder('errors')
      .select([
        'errors.method as method',
        'errors.path as path',
        'count(*)::int as count',
      ])
      .groupBy('errors.method')
      .addGroupBy('errors.path')
      .orderBy(`count(*)`, 'DESC')
      .where('errors.created_at > :date', { date: dateFrom({ days: -7 }) });

    return queryBuilder.getRawMany();
  }

  async getWeekTime(query: AnalyticsTimeDto) {
    const queryBuilder = this.endpointTimeRepo
      .createQueryBuilder('time')
      .select([
        'time.lower_limit as lower_limit',
        'sum(time.calls)::int as calls',
      ])
      .addGroupBy('time.lower_limit')
      .orderBy('time.lower_limit')
      .where('time.time > :date', { date: dateFrom({ days: -7 }) });

    if (query.method)
      queryBuilder.andWhere('time.method = :method', { method: query.method });
    if (query.path)
      queryBuilder.andWhere('time.path = :path', { path: query.path });

    const data = await queryBuilder.getRawMany<{
      lower_limit: number;
      calls: number;
    }>();

    return {
      query: Object.keys(query).length ? query : null,
      date: data.map((el) => ({
        ...el,
        uper_limit: el.lower_limit + time_group_size,
      })),
    };
  }

  async getWeekTimeGroups() {
    return this.endpointTimeRepo
      .createQueryBuilder('time')
      .select(['time.method as method', 'time.path as path'])
      .addGroupBy('time.method')
      .addGroupBy('time.path')
      .addOrderBy('time.method')
      .addOrderBy('time.path')
      .getRawMany();
  }
}
