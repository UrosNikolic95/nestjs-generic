import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { WatchLabelEntity } from './watch-label';
import { IWatch } from './watch.interface';

@Entity()
export class WatchIntValueEntity extends BaseEntity implements IWatch<number> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label_id: number;

  @ManyToOne(() => WatchLabelEntity, (el) => el.values)
  label: WatchLabelEntity;

  @Column()
  value: number;

  @CreateDateColumn()
  time: Date;
}
