import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DefaultNamingStrategy } from 'typeorm';
import {
  UserDataEntity,
  WatchValueEntity,
  WatchLabelEntity,
  WatchIntValueEntity,
  WatchFloatValueEntity,
  createWatchSubscriber,
} from '../src';
import { Test1Entity } from '../test/data/test1.entity';
import { Test2Entity } from '../test/data/test2.entity';

class SnakeNameingStrategy extends DefaultNamingStrategy {
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return `${relationName}_id`;
  }
}

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [
    Test1Entity,
    Test2Entity,
    UserDataEntity,
    WatchValueEntity,
    WatchLabelEntity,
    WatchIntValueEntity,
    WatchFloatValueEntity,
  ],
  synchronize: true,
  logging: true,
  namingStrategy: new SnakeNameingStrategy(),
  subscribers: [
    createWatchSubscriber(
      UserDataEntity,
      (el) => el.id,
      (el) => el.email,
    ),
    createWatchSubscriber(
      Test2Entity,
      (el) => el.id,
      (el) => el.number,
    ),
  ],
};
