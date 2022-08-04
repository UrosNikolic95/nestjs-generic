import { ApiProperty } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();
import {
  BaseEntity,
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TestEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  field: string;
}

export async function getConnection() {
  const connection = new DataSource({
    type: 'postgres',
    url: process.env.DB_URL,
    entities: [TestEntity],
    synchronize: true,
  });
  await connection.initialize();
  return connection;
}
