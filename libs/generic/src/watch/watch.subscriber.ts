import { Type } from '@nestjs/common';
import { getField } from 'type-safe-select';
import {
  BaseEntity,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { WatchFloatValueEntity } from './watch-float-value.entity';
import { WatchIntValueEntity } from './watch-int-value.entity';
import { WatchLabelEntity } from './watch-label';
import { WatchValueEntity } from './watch-value.entity';

export function createWatchSubscriber<T extends BaseEntity>(
  entityType: Type<T>,
  idGetter: (el: T) => any,
  valueGetter: (el: T) => any,
): Type<EntitySubscriberInterface<T>> {
  @EventSubscriber()
  class WatchSubscriber implements EntitySubscriberInterface<T> {
    listenTo(): Function {
      return entityType;
    }

    async beforeUpdate(event: UpdateEvent<T>): Promise<any> {
      const entity = event.entity as T;
      const databaseEntity = event.databaseEntity as T;
      const oldVal = valueGetter(databaseEntity)?.toString();
      const newVal = valueGetter(entity)?.toString();
      const field = getField(valueGetter);
      const repo = event.manager.getRepository(entityType);
      const type = repo.metadata.columns.find(
        (el) => el.propertyName == field,
      ).type;

      console.log('>>>', type);

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

        if (type == 'int' || type == Number) {
          await event.manager
            .create(WatchIntValueEntity, {
              label_id: label.id,
              value: valueGetter(entity)?.toString(),
            })
            .save();
        } else if (type == 'float') {
          await event.manager
            .create(WatchFloatValueEntity, {
              label_id: label.id,
              value: valueGetter(entity)?.toString(),
            })
            .save();
        } else {
          await event.manager
            .create(WatchValueEntity, {
              label_id: label.id,
              value: valueGetter(entity)?.toString(),
            })
            .save();
        }
      }
    }
  }
  return WatchSubscriber;
}
