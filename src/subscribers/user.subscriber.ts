import { exec } from 'child_process';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { hash } from 'bcrypt';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { userDatabase } from '../auth/auth.const';

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(
    @InjectDataSource(userDatabase)
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
