import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Test2Entity } from './test2.entity';

@Entity()
export class Test1Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  field: string;

  @Column({ nullable: true })
  test_2_id: number;

  @ApiProperty()
  @ManyToOne(() => Test2Entity, (el) => el.test_1)
  test_2: Test2Entity;
}
