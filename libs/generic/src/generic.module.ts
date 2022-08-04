import { Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntity } from 'typeorm';
import { getController } from './generic.controller';
import { EntityType } from './generic.interface';

export function getGenericModule<T extends EntityType>(
  entities: Type<T>[],
): Type {
  @Module({
    imports: [TypeOrmModule.forFeature(entities)],
    controllers: entities.map((entity) => getController(entity)),
  })
  class GenericModule {}

  return GenericModule;
}
