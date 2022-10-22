import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { UserEntity } from '../libs/generic/src/entities/user.entity';
import { WatchFloatValueEntity } from '../libs/generic/src/watch/watch-float-value.entity';
import { WatchIntValueEntity } from '../libs/generic/src/watch/watch-int-value.entity';
import { WatchLabelEntity } from '../libs/generic/src/watch/watch-label';
import { WatchValueEntity } from '../libs/generic/src/watch/watch-value.entity';
import { createWatchSubscriber } from '../libs/generic/src/watch/watch.subscriber';
import { Test1Entity } from '../libs/generic/testing/test1.entity';
import { Test2Entity } from '../libs/generic/testing/test2.entity';

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
    UserEntity,
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
