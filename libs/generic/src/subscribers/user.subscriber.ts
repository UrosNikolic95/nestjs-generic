import { exec } from 'child_process';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { hash } from 'bcrypt';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  async beforeInsert(
    event: InsertEvent<UserEntity>,
  ): Promise<void | Promise<any>> {
    if (event?.entity?.password) {
      event.entity.password = await hash(event.entity.password, 10);
    }
  }

  async beforeUpdate(
    event: UpdateEvent<UserEntity>,
  ): Promise<void | Promise<any>> {
    if (event?.entity?.password) {
      event.entity.password = await hash(event.entity.password, 10);
    }
  }
}
