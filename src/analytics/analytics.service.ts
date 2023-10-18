import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EndpointTimeEntity } from './entities/endpoint-time.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { dateFrom } from './analytics.helpers';
import { ErrorEntity } from './entities/error.entity';
import { AnalyticsErrorDto } from './dtos/analytics-error.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ErrorEntity)
    readonly errorRepo: Repository<ErrorEntity>,
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
}
