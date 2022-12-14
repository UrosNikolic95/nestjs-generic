import { Type as TypeInterface } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type as TypeTransformer } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { IPaginationResponse } from './crud.interface';

export class RequestManyDto {
  @ApiProperty({ type: Number, default: 1, required: false })
  @IsOptional()
  @TypeTransformer(() => Number)
  @IsNumber()
  page = 1;

  @ApiProperty({ type: Number, default: 10, required: false })
  @IsOptional()
  @TypeTransformer(() => Number)
  @IsNumber()
  limit = 10;
}

export class RequestManyResponeDto<T> implements IPaginationResponse<T> {
  items: T[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
