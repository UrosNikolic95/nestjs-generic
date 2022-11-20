import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Test1Entity } from './test1.entity';

@Entity()
export class Test2Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  number: number;

  @OneToMany(() => Test1Entity, (el) => el.test_2)
  test_1: Test1Entity[];
}
