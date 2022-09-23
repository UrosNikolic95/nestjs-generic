import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Test2Entity } from './test2.entity';

@Entity()
export class Test1Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  field: string;

  @ApiProperty()
  @Column({ nullable: true })
  test_2_id: number;

  @ManyToOne(() => Test2Entity, (el) => el.test_1)
  @JoinColumn({ name: 'test_2_id' })
  test_2: Test2Entity;
}
