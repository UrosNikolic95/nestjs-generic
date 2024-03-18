import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../data/database.config';
import { Test1Entity } from './test1.entity';
import { Test2Entity } from './test2.entity';
import { getGenericModule } from '../../src/crud/crud.module';
import { getViewerController } from '../../src/viewer/viewer.controller';
import { JwtAuth } from '../../src/auth/auth-user/guards/jwt.guard';
import { AnalyticsModule } from '../../src/analytics/analytics.module';
import { envConfig } from '../../src/config';

@JwtAuth()
class controller extends getViewerController('view', Test1Entity, {
  select: {
    a1: (el) => el.field,
    a2: (el) => el.test_2.number,
    a3: (el) => el.test_2.test_1.field,
  },
  limit: 3,
}) {}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig,
      name: envConfig.USER_DB_NAME,
    }),
    TypeOrmModule.forFeature([Test1Entity, Test2Entity]),
    getGenericModule([Test1Entity, Test2Entity]),
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
