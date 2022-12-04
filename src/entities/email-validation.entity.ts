import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'email_validation' })
export class EmailValidationEntity extends BaseEntity {
  @PrimaryColumn()
  email: string;

  @Column({ unique: true })
  code: string;
}
