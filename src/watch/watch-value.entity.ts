import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WatchLabelEntity } from './watch-label';
import { IWatch } from './watch.interface';

@Entity()
export class WatchValueEntity extends BaseEntity implements IWatch<string> {
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
