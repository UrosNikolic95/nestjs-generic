import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeviceEntity } from './device.entity';
import { IUser } from '../../../types/user.interface';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements IUser {
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

  @ApiProperty()
  @Column({ default: false })
  email_validated: boolean;

  @ApiHideProperty()
  @Column({ nullable: true, unique: true, select: false })
  @Exclude()
  email_validation_code: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiProperty()
  @Column({ default: false })
  phone_validated: boolean;

  @ApiHideProperty()
  @Column({ nullable: true, unique: true, select: false })
  @Exclude()
  phone_validation_code: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ select: false })
  password: string;

  @ApiHideProperty()
  @Column({ nullable: true, select: false, unique: true })
  @Exclude()
  set_password_code: string;

  @OneToMany(() => DeviceEntity, (el) => el.user)
  device: DeviceEntity;
}
