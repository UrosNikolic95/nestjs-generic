import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user-avatar.entity';

@Entity({ name: 'user_data' })
export class UserDataEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  email_validated: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ nullable: true, select: false, unique: true })
  @Exclude()
  set_password_code: string;
}
