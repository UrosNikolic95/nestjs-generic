import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'endpoint_time' })
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

  @CreateDateColumn()
  created_at: Date;
}
