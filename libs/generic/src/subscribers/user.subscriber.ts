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

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

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
