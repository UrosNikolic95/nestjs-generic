import { exec } from 'child_process';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { hash } from 'bcrypt';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { userDatabase } from '../auth.const';
import { AdminEntity } from './entities/admin.entity';

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

@Injectable()
export class AdminSubscriber implements EntitySubscriberInterface<AdminEntity> {
  constructor(
    @InjectDataSource(userDatabase)
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return AdminEntity;
  }

  async beforeInsert(
    event: InsertEvent<AdminEntity>,
  ): Promise<void | Promise<any>> {
    if (event?.entity?.password) {
      event.entity.password = await hash(event.entity.password, randInt(10));
    }
  }

  async beforeUpdate(
    event: UpdateEvent<AdminEntity>,
  ): Promise<void | Promise<any>> {
    if (event?.entity?.password) {
      event.entity.password = await hash(event.entity.password, randInt(10));
    }
  }
}
