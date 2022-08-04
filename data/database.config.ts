import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Test1Entity } from '../libs/generic/testing/connection';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [Test1Entity],
  synchronize: true,
};
