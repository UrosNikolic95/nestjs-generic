import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../data/database.config';
import { AuthModule } from '../libs/generic/src/auth/auth.module';
import { getGenericModule } from '../libs/generic/src/crud/crud.module';
import { UserEntity } from '../libs/generic/src/entities/user.entity';
import { getViewerController } from '../libs/generic/src/viewer/viewer.controller';
import { Test1Entity } from '../libs/generic/testing/test1.entity';
import { Test2Entity } from '../libs/generic/testing/test2.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Test1Entity]),
    getGenericModule([Test1Entity, Test2Entity, UserEntity]),
    AuthModule,
  ],
  controllers: [
    AppController,
    getViewerController('view', Test1Entity, {
      select: {
        abc: (el) => el.field,
      },
      orderBy: {
        abc: 'ASC',
      },
      skip: 0,
      take: 10,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
