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

  @Column({ type: 'jsonb', nullable: true })
  body: any;

  @Column({ type: 'jsonb', nullable: true })
  query: any;

  @Column({ type: 'jsonb', nullable: true })
  params: any;

  @CreateDateColumn()
  created_at: Date;
}
