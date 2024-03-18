import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { hash } from 'bcrypt';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { envConfig } from '../../config';

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(
    @InjectDataSource(envConfig.USER_DB_NAME)
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  async beforeInsert(
    event: InsertEvent<UserEntity>,
  ): Promise<void | Promise<any>> {
    if (event?.entity?.password) {
      event.entity.password = await hash(event.entity.password, randInt(10));
    }
  }

  async beforeUpdate(
    event: UpdateEvent<UserEntity>,
  ): Promise<void | Promise<any>> {
    if (event?.entity?.password) {
      event.entity.password = await hash(event.entity.password, randInt(10));
    }
  }
}
