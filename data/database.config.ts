import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DefaultNamingStrategy } from 'typeorm';
import {
  UserEntity,
  WatchValueEntity,
  WatchLabelEntity,
  WatchIntValueEntity,
  WatchFloatValueEntity,
  createWatchSubscriber,
} from '../src';
import { Test1Entity } from '../test/data/test1.entity';
import { Test2Entity } from '../test/data/test2.entity';
import { envConfig } from '../src/config';

class SnakeNameingStrategy extends DefaultNamingStrategy {
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return `${relationName}_id`;
  }
}

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: envConfig.USERS_DB_URL || envConfig.DB_URL,
  entities: [
    Test1Entity,
    Test2Entity,
    UserEntity,
    WatchValueEntity,
    WatchLabelEntity,
    WatchIntValueEntity,
    WatchFloatValueEntity,
  ],
  synchronize: true,
  namingStrategy: new SnakeNameingStrategy(),
  subscribers: [
    createWatchSubscriber(
      UserEntity,
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
