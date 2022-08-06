import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityMetadata, Repository } from 'typeorm';
import { RequestManyDto, RequestManyResponeDto } from './generic.dto';
import {
  EntityType,
  IGenericController,
  IPaginationResponse,
} from './generic.interface';
import { GenericFunctions } from './generic.functions';
import {
  ApiBody,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from './generic.decorators';

export function getController<T extends EntityType>(
  entity: Type<T>,
): Type<IGenericController<T>> {
  const name = entity.prototype.constructor.name;

  @ApiExtraModels(RequestManyResponeDto)
  @ApiTags(name)
  @Controller(name)
  class GenericController implements IGenericController<T> {
    service: GenericFunctions<T>;

    constructor(@InjectRepository(entity) repo: Repository<T>) {
      this.service = new GenericFunctions(repo);
    }

    @ApiPaginatedResponse(entity)
    @Get()
    requestMany(
      @Query() query: RequestManyDto,
    ): Promise<IPaginationResponse<T>> {
      return this.service.requestMany(query);
    }

    @ApiResponse({ type: entity })
    @Get(':id')
    requestOne(@Param('id') id: number): Promise<T> {
      return this.service.requestOne(id);
    }

    @ApiBody({ type: entity })
    @ApiResponse({ type: entity })
    @Post()
    create(@Body() body: T): Promise<T> {
      return this.service.create(body);
    }

    @ApiResponse({ type: entity })
    @Delete(':id')
    delete(@Param('id') id: number): Promise<T> {
      return this.service.delete(id);
    }

    @ApiBody({ type: entity })
    @ApiResponse({ type: entity })
    @Put(':id')
    update(@Param('id') id: number, @Body() body: T): Promise<T> {
      return this.service.update(id, body);
    }
  }

  return GenericController;
}
