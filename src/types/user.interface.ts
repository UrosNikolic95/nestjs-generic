import { IDevice } from './device.interface';

export interface IUser {
  id: number;

  username: string;

  imageUrl: string;

  email: string;

  email_validated: boolean;

  email_validation_code: string;

  phone: string;

  phone_validated: boolean;

  phone_validation_code: string;

  password: string;

  set_password_code: string;

  device: IDevice;
}
