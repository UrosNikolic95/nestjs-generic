import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { Test1Entity } from './test1.entity';
import { Test2Entity } from './test2.entity';

export async function getConnection() {
  const connection = new DataSource({
    type: 'postgres',
    url: process.env.DB_URL,
    entities: [Test1Entity, Test2Entity],
    synchronize: true,
  });
  await connection.initialize();
  return connection;
}
