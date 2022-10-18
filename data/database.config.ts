import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../libs/generic/src/entities/user.entity';
import { WatchEntity } from '../libs/generic/src/watch/watch.entity';
import { createWatchSubscriber } from '../libs/generic/src/watch/watch.subscriber';
import { Test1Entity } from '../libs/generic/testing/test1.entity';
import { Test2Entity } from '../libs/generic/testing/test2.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [Test1Entity, Test2Entity, UserEntity, WatchEntity],
  synchronize: true,
  subscribers: [
    createWatchSubscriber(
      UserEntity,
      (el) => el.id,
      (el) => el.email,
    ),
  ],
};
