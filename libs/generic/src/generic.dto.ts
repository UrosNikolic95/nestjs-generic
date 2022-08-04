import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class RequestManyDto {
  @ApiProperty({ type: Number, default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page = 1;

  @ApiProperty({ type: Number, default: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit = 10;

  get skip() {
    return (this.page - 1) * this.limit;
  }

  get take() {
    return this.limit;
  }
}

export class RequestManyResponeDto<T> {
  constructor(obj: RequestManyResponeDto<T>) {
    Object.assign(this, obj);
  }

  items: T[];
  count: number;
  page: number;
  limit: number;
}
