import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { IDevice } from '../../../types/device.interface';
import { IGenerateModule } from '../interfaces/generate-module.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IUser } from '../../../types/user.interface';

export function authEntityFactory(data: IGenerateModule) {
  @Entity({ name: `${data.name}-device` })
  class DeviceEntity extends BaseEntity implements IDevice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @ManyToOne(() => UserEntity, (el) => el.device, { onDelete: 'CASCADE' })
    user: IUser;

    @Column({ unique: true })
    token: string;

    @CreateDateColumn()
    created_at: Date;
  }

  @Entity({ name: `${data.name}-invitation` })
  class InvitationEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    code: string;
  }

  @Entity({ name: data.name })
  class UserEntity extends BaseEntity implements IUser {
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

    @OneToMany(() => DeviceEntity, (el) => el.user)
    device: IDevice;
  }

  data.UserEntity = UserEntity;
  data.InvitationEntity = InvitationEntity;
  data.DeviceEntity = DeviceEntity;
}
