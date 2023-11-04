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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestManyDto, RequestManyResponeDto } from './crud.dto';
import {
  EntityType,
  IGenericController,
  IPaginationResponse,
} from './crud.interface';
import { GenericFunctions } from './crud.functions';
import { ApiBody, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from './crud.decorators';
import { Response } from 'express';
import { Where, Flatten } from 'type-safe-select';
import { FileInterceptor } from '@nestjs/platform-express';

export function getController<T extends EntityType, query>(
  entity: Type<T>,
  queryParam?: (el: query) => Where<Flatten<T>>,
): Type<IGenericController<T>> {
  const name = entity.prototype.constructor.name;

  @ApiExtraModels(RequestManyResponeDto)
  @ApiTags(name)
  @Controller(name)
  class GenericController implements IGenericController<T> {
    service: GenericFunctions<T>;

    constructor(@InjectRepository(entity) repo: Repository<T>) {
      this.service = new GenericFunctions(repo, queryParam);
    }

    @ApiPaginatedResponse(entity)
    @Get()
    requestMany(
      @Query() query: RequestManyDto,
    ): Promise<IPaginationResponse<T>> {
      return this.service.requestMany(query);
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('import')
    async import(@UploadedFile() file: Express.Multer.File) {
      await this.service.import(file);
    }

    @Get('export')
    async export(@Res() res: Response): Promise<void> {
      await this.service.export(res);
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
