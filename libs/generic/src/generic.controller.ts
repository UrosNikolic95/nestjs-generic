import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BaseEntity,
  DataSource,
  EntityMetadata,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { RequestManyDto, RequestManyResponeDto } from './generic.dto';
import { EntityType, IGenericController } from './generic.interface';
import { GenericFunctions } from './generic.functions';
import { ApiBody, ApiTags } from '@nestjs/swagger';

export function getController<T extends EntityType>(
  entity: Type<T>,
): Type<IGenericController<T>> {
  EntityMetadata;

  const name = entity.prototype.constructor.name;

  @ApiTags(name)
  @Controller(name)
  class GenericController implements IGenericController<T> {
    service: GenericFunctions<T>;

    constructor(@InjectRepository(entity) repo: Repository<T>) {
      this.service = new GenericFunctions(repo);
    }

    @Get()
    requestMany(query: RequestManyDto): Promise<RequestManyResponeDto<T>> {
      return this.service.requestMany(query);
    }

    @Get(':id')
    requestOne(@Param('id') id: number): Promise<T> {
      return this.service.requestOne(id);
    }

    @ApiBody({ type: entity })
    @Post()
    create(@Body() body: T): Promise<T> {
      return this.service.create(body);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<T> {
      return this.service.delete(id);
    }

    @ApiBody({ type: entity })
    @Put(':id')
    update(@Param('id') id: number, @Body() body: T): Promise<T> {
      return this.service.update(id, body);
    }
  }

  return GenericController;
}
