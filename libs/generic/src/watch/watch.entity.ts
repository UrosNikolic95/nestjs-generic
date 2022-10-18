import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WatchEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instance_id: string;

  @Column()
  emtity_name: string;

  @Column()
  field_name: string;

  @Column()
  value: string;

  @CreateDateColumn()
  time: Date;
}
