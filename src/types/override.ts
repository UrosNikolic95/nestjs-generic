import { UserEntity } from '../entities/user.entity';
declare global {
  namespace Express {
    interface User extends UserEntity {}
  }
}
