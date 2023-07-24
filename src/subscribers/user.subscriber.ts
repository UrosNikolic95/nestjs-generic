import { exec } from 'child_process';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserDataEntity } from '../entities/user-data.entity';
import { hash } from 'bcrypt';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

@Injectable()
export class UserSubscriber
  implements EntitySubscriberInterface<UserDataEntity>
{
  constructor(
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return UserDataEntity;
  }

  async beforeInsert(
    event: InsertEvent<UserDataEntity>,
  ): Promise<void | Promise<any>> {
    if (event?.entity?.password) {
      event.entity.password = await hash(event.entity.password, randInt(10));
    }
  }

  async beforeUpdate(
    event: UpdateEvent<UserDataEntity>,
  ): Promise<void | Promise<any>> {
    if (event?.entity?.password) {
      event.entity.password = await hash(event.entity.password, randInt(10));
    }
  }
}
