import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityMetadata, Repository } from 'typeorm';
import { RequestManyDto, RequestManyResponeDto } from './crud.dto';
import {
  EntityType,
  IGenericController,
  IPaginationResponse,
} from './crud.interface';
import { GenericFunctions } from './crud.functions';
import {
  ApiBody,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from './crud.decorators';
import { Response } from 'express';

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

    @Get('export')
    async export(@Res() res: Response) {
      const data = await this.service.export();
      res.header('Content-Type', 'text/csv');
      res.attachment('orders.csv');
      res.send(data);
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
