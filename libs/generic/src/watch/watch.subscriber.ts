import { Type } from '@nestjs/common';
import { getField } from 'type-safe-select';
import {
  BaseEntity,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { WatchEntity } from './watch.entity';

export function createWatchSubscriber<T extends BaseEntity>(
  entity: Type<T>,
  idGetter: (el: T) => any,
  valueGetter: (el: T) => any,
): Type<EntitySubscriberInterface<T>> {
  @EventSubscriber()
  class WatchSubscriber implements EntitySubscriberInterface<T> {
    listenTo(): Function {
      return entity;
    }

    async beforeUpdate(event: UpdateEvent<T>): Promise<any> {
      const entity = event.entity as T;
      const databaseEntity = event.databaseEntity as T;
      const oldVal = valueGetter(databaseEntity)?.toString();
      const newVal = valueGetter(entity)?.toString();
      if (newVal && oldVal != newVal) {
        await event.manager
          .create(WatchEntity, {
            instance_id: idGetter(entity)?.toString(),
            emtity_name: Object.getPrototypeOf(entity)?.constructor?.name,
            field_name: getField(valueGetter),
            value: valueGetter(entity)?.toString(),
          })
          .save();
      }
    }
  }
  return WatchSubscriber;
}
