import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController {
  constructor(readonly analyticsService: AnalyticsService) {}

  @Get('endpoints/errors')
  getWeekExceptions() {
    return this.analyticsService.getWeekExceptions();
  }
}
