import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsErrorDto } from './dtos/analytics-error.dto';
import { AnalyticsTimeDto } from './dtos/analytics-time.dto';

@Controller()
export class AnalyticsController {
  constructor(readonly analyticsService: AnalyticsService) {}

  @Get('endpoints/errors')
  getWeekExceptions(@Query() queryReq: AnalyticsErrorDto) {
    return this.analyticsService.getWeekExceptions(queryReq);
  }

  @Get('endpoints/errors/paths')
  getWeekExceptionsPerPath() {
    return this.analyticsService.getWeekExceptionsPerPath();
  }

  @Get('endpoints/time')
  getWeekTime(@Query() query: AnalyticsTimeDto) {
    return this.analyticsService.getWeekTime(query);
  }

  @Get('endpoints/time/groups')
  getWeekTimeGroups() {
    return this.analyticsService.getWeekTimeGroups();
  }
}
