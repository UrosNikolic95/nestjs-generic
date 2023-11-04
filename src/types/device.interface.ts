import { IUser } from './user.interface';

export interface IDevice {
  id: number;

  user_id: number;

  user?: IUser;

  token: string;

  created_at: Date;
}
