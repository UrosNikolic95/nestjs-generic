import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './error.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorEntity } from './entities/error.entity';
import { EndpointTimeEntity } from './entities/endpoint-time.entity';
import { EndpointTimeInterceptor } from './endpoint-time.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ErrorEntity, EndpointTimeEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: EndpointTimeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    AnalyticsService,
  ],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
