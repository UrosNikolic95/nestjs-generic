import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../libs/generic/src/entities/user.entity';
import { Test1Entity } from '../libs/generic/testing/test1.entity';
import { Test2Entity } from '../libs/generic/testing/test2.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [Test1Entity, Test2Entity, UserEntity],
  synchronize: true,
};
