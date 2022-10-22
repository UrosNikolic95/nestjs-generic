import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WatchLabelEntity } from './watch-label';

@Entity()
export class WatchValueEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label_id: number;

  @ManyToOne(() => WatchLabelEntity, (el) => el.values)
  label: WatchLabelEntity;

  @Column()
  value: string;

  @CreateDateColumn()
  time: Date;
}
