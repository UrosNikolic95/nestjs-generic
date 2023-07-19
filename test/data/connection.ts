import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { Test1Entity } from './test1.entity';
import { Test2Entity } from './test2.entity';
import { envConfig } from '../../src/config';

export async function getConnection() {
  const connection = new DataSource({
    type: 'postgres',
    url: envConfig.DB_URL,
    entities: [Test1Entity, Test2Entity],
    synchronize: true,
  });
  await connection.initialize();
  return connection;
}
