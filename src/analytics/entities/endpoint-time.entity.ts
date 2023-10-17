import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  called_at: Date;
}
