import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import {
  EntitySubscriberInterface,
  DataSource,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { IGenerateModule } from '../interfaces/generate-module.interface';
import { randInt } from '../auth.helpers';

export function authSubscriberFactory(data: IGenerateModule) {
  @Injectable()
  class AdminSubscriber implements EntitySubscriberInterface<any> {
    constructor(
      @InjectDataSource(data?.userDatabase)
      dataSource: DataSource,
    ) {
      dataSource.subscribers.push(this);
    }

    listenTo() {
      return data.UserEntity;
    }

    async beforeInsert(event: InsertEvent<any>): Promise<void | Promise<any>> {
      if (event?.entity?.password) {
        event.entity.password = await hash(event.entity.password, randInt(10));
      }
    }

    async beforeUpdate(event: UpdateEvent<any>): Promise<void | Promise<any>> {
      if (event?.entity?.password) {
        event.entity.password = await hash(event.entity.password, randInt(10));
      }
    }
  }

  data.AdminSubscriber = AdminSubscriber;
}
