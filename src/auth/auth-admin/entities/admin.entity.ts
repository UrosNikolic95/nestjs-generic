import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminDeviceEntity } from './admin-device.entity';
import { IUser } from '../../../types/user.interface';

@Entity({ name: 'admin' })
export class AdminEntity extends BaseEntity implements IUser {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  email_validated: boolean;

  @Column({ nullable: true, unique: true })
  email_validation_code: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  phone_validated: boolean;

  @Column({ nullable: true, unique: true })
  phone_validation_code: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ nullable: true, select: false, unique: true })
  @Exclude()
  set_password_code: string;

  @OneToMany(() => AdminDeviceEntity, (el) => el.user)
  device: AdminDeviceEntity;
}
