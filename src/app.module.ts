import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../data/database.config';
import { AuthModule } from '../libs/generic/src/auth/auth.module';
import { getGenericModule } from '../libs/generic/src/crud/crud.module';
import { UserEntity } from '../libs/generic/src/entities/user.entity';
import { getViewerController } from '../libs/generic/src/viewer/viewer.controller';
import { Test1Entity } from '../libs/generic/testing/test1.entity';
import { Test2Entity } from '../libs/generic/testing/test2.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Test1Entity]),
    getGenericModule([Test1Entity, Test2Entity, UserEntity]),
    AuthModule,
  ],
  controllers: [
    getViewerController('view', Test1Entity, {
      select: {
        a1: (el) => el.field,
        a2: (el) => el.test_2.number,
        a3: (el) => el.test_2.test_1.field,
      },
      limit: 3,
    }),
  ],
  providers: [],
})
export class AppModule {}
