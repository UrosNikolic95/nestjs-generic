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
export class WatchFloatValueEntity
  extends BaseEntity
  implements IWatch<number>
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label_id: number;

  @ManyToOne(() => WatchLabelEntity, (el) => el.values)
  label: WatchLabelEntity;

  @Column({ type: 'float' })
  value: number;

  @CreateDateColumn()
  time: Date;
}
