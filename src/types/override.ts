import { UserDataEntity } from '../entities/user-data.entity';
declare global {
  namespace Express {
    interface User extends UserDataEntity {}
  }
}
