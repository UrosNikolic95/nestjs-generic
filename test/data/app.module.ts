import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../data/database.config';
import { Test1Entity } from './test1.entity';
import { Test2Entity } from './test2.entity';
import { AuthModule } from '../../src/auth/auth.module';
import { getGenericModule } from '../../src/crud/crud.module';
import { UserDataEntity } from '../../src/entities/user-data.entity';
import { getViewerController } from '../../src/viewer/viewer.controller';
import { JwtAuth } from '../../src';

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
      name: 'abc',
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig,
    }),
    TypeOrmModule.forFeature([Test1Entity]),
    getGenericModule([Test1Entity, Test2Entity, UserDataEntity]),
    AuthModule(),
  ],
  controllers: [controller],
  providers: [],
})
export class AppModule {}
