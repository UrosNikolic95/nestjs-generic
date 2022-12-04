import { UserDataEntity } from '../entities/user.entity';
declare global {
  namespace Express {
    interface User extends UserDataEntity {}
  }
}
