import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TestEntity } from '../libs/generic/testing/connection';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [TestEntity],
  synchronize: true,
};
