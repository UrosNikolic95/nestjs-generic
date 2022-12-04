import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserAvatarEntity } from './user-avatar.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @OneToOne(() => UserAvatarEntity)
  @JoinColumn({ name: 'id' })
  avatar: UserAvatarEntity;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ nullable: true, select: false })
  @Exclude()
  setPasswordHash: string;
}
