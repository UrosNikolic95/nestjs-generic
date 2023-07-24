import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserDataEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  email_validated: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  phone_validated: boolean;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ nullable: true, select: false, unique: true })
  @Exclude()
  set_password_code: string;
}
