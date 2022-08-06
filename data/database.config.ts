import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../libs/generic/src/entities/user.entity';
import { UserSubscriber } from '../libs/generic/src/subscribers/user.subscriber';
import { Test1Entity, Test2Entity } from '../libs/generic/testing/connection';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [Test1Entity, Test2Entity, UserEntity],
  synchronize: true,
};
