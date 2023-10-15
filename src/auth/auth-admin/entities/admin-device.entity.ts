import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entity';
import { IDevice } from '../../../types/device.interface';

@Entity({ name: 'admin-device' })
export class AdminDeviceEntity extends BaseEntity implements IDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => AdminEntity, (el) => el.device)
  user: AdminEntity;

  @Column({ unique: true })
  token: string;

  @CreateDateColumn()
  created_at: Date;
}
