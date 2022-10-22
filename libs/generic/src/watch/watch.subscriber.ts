import { Type } from '@nestjs/common';
import { getField } from 'type-safe-select';
import {
  BaseEntity,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { WatchLabelEntity } from './watch-label';
import { WatchValueEntity } from './watch-value.entity';

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
        const label =
          (await event.manager.findOne(WatchLabelEntity, {
            where: {
              instance_id: idGetter(entity)?.toString(),
              entity_name: Object.getPrototypeOf(entity)?.constructor?.name,
              field_name: getField(valueGetter),
            },
          })) ||
          (await event.manager
            .create(WatchLabelEntity, {
              instance_id: idGetter(entity)?.toString(),
              entity_name: Object.getPrototypeOf(entity)?.constructor?.name,
              field_name: getField(valueGetter),
            })
            .save());

        await event.manager
          .create(WatchValueEntity, {
            label_id: label.id,
            value: valueGetter(entity)?.toString(),
          })
          .save();
      }
    }
  }
  return WatchSubscriber;
}
