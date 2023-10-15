import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { IDevice } from '../../../types/device.interface';

@Entity({ name: 'device' })
export class DeviceEntity extends BaseEntity implements IDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => UserEntity, (el) => el.device)
  user: UserEntity;

  @Column({ unique: true })
  token: string;

  @CreateDateColumn()
  created_at: Date;
}
