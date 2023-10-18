import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsErrorDto } from './dtos/analytics-error.dto';

@Controller()
export class AnalyticsController {
  constructor(readonly analyticsService: AnalyticsService) {}

  @Get('endpoints/errors')
  getWeekExceptions(@Query() queryReq: AnalyticsErrorDto) {
    return this.analyticsService.getWeekExceptions(queryReq);
  }

  @Get('endpoints/paths')
  getWeekExceptionsPerPath() {
    return this.analyticsService.getWeekExceptionsPerPath();
  }
}
