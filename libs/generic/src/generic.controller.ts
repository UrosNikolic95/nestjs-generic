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
import { BaseEntity, Repository, UpdateDateColumn } from 'typeorm';
import { RequestManyDto, RequestManyResponeDto } from './generic.dto';
import { EntityType, IGenericController } from './generic.interface';
import { GenericFunctions } from './generic.functions';

export function getController<T extends EntityType>(
  entity: Type<T>,
): Type<IGenericController<T>> {
  @Controller()
  class GenericController implements IGenericController<T> {
    service: GenericFunctions<T>;

    constructor(@InjectRepository(entity) repo: Repository<T>) {
      this.service = new GenericFunctions(repo);
    }

    @Get()
    requestMany(query: RequestManyDto): Promise<RequestManyResponeDto<T>> {
      return this.requestMany(query);
    }

    @Get(':id')
    requestOne(@Param('id') id: number): Promise<T> {
      return this.requestOne(id);
    }

    @Post()
    create(@Body() body: T): Promise<T> {
      return this.create(body);
    }

    @Delete(':id')
    delete(@Param() id: number): Promise<T> {
      return this.delete(id);
    }

    @Put()
    update(@Body() body: T): Promise<T> {
      return this.update(body);
    }
  }

  return GenericController;
}
