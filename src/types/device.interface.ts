import { BaseEntity } from 'typeorm';
import { IUser } from './user.interface';

export interface IDevice extends BaseEntity {
  id: number;

  user_id: number;

  user?: IUser;

  token: string;

  created_at: Date;
}
