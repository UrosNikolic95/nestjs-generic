import { Expose } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { time_group_size } from '../analytics.consts';

export const endpointTimeUniq = ['method', 'path', 'lower_limit', 'time'];

@Entity({ name: 'endpoint_time' })
@Unique(endpointTimeUniq)
export class EndpointTimeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column()
  lower_limit: number;

  @Expose()
  get uper_limit() {
    return this.lower_limit + time_group_size;
  }

  @Column()
  calls: number;

  @Column()
  time: Date;
}
