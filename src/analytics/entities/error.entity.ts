import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'error' })
export class ErrorEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column()
  message: string;

  @Column()
  stack: string;

  @CreateDateColumn()
  created_at: Date;
}
