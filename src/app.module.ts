import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../data/database.config';
import { Test1Entity } from '../test/data/test1.entity';
import { Test2Entity } from '../test/data/test2.entity';
import { AuthModule } from './auth/auth.module';
import { getGenericModule } from './crud/crud.module';
import { UserEntity } from './entities/user.entity';
import { getViewerController } from './viewer/viewer.controller';

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
