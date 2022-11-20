import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { WatchValueEntity } from './watch-value.entity';

@Entity()
@Unique(['instance_id', 'entity_name', 'field_name'])
export class WatchLabelEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instance_id: string;

  @Column()
  entity_name: string;

  @Column()
  field_name: string;

  @OneToMany(() => WatchValueEntity, (el) => el.label)
  values: WatchValueEntity[];
}
