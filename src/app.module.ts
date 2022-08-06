import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../data/database.config';
import { AuthModule } from '../libs/generic/src/auth/auth.module';
import { getGenericModule } from '../libs/generic/src/crud/crud.module';
import { UserEntity } from '../libs/generic/src/entities/user.entity';
import { Test1Entity, Test2Entity } from '../libs/generic/testing/connection';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    getGenericModule([Test1Entity, Test2Entity, UserEntity]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
