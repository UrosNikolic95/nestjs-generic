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
export class Test1Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  field: string;
}

@Entity()
export class Test2Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  number: number;
}

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
