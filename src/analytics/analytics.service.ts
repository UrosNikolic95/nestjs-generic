import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EndpointTimeEntity } from './entities/endpoint-time.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { dateFrom } from './analytics.helpers';
import { ErrorEntity } from './entities/error.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ErrorEntity)
    readonly errorRepo: Repository<ErrorEntity>,
  ) {}

  getWeekExceptions() {
    return this.errorRepo
      .createQueryBuilder('errors')
      .select([
        "date_trunc('hour',errors.created_at) as time",
        'errors.method as method',
        'errors.path as path',
        'count(*)::int as count',
      ])
      .groupBy(`date_trunc('hour',errors.created_at)`)
      .addGroupBy(`errors.method`)
      .addGroupBy(`errors.path`)
      .orderBy(`date_trunc('hour',errors.created_at)`, 'ASC')
      .where('errors.created_at > :date', { date: dateFrom({ days: -7 }) })
      .getRawMany()
      .catch(console.error);
  }
}
