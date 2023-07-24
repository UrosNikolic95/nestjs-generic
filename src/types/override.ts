import { UserEntity } from '../entities/user-data.entity';

declare global {
  namespace Express {
    interface Request {
      user: UserEntity;
    }
  }
}
