import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export const endpointTimeUniq = ['method', 'path', 'time'];

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
  milliseconds: number;

  @Column()
  calls: number;

  @Column()
  time: Date;
}
