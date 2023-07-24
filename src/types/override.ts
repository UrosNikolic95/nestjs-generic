import { UserDataEntity } from '../entities/user-data.entity';

declare global {
  namespace Express {
    interface Request {
      user: UserDataEntity;
    }
  }
}
