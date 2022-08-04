import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../data/database.config';
import { getController } from '../libs/generic/src';
import { TestEntity } from '../libs/generic/testing/connection';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([TestEntity]),
  ],
  controllers: [AppController, getController(TestEntity)],
  providers: [AppService],
})
export class AppModule {}
