import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsNumberOptions,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

interface QueryOptions {
  required?: boolean;
  isArray?: boolean;
  numOpt?: IsNumberOptions;
  enumType?: any;
}

export class QueryDecorators {
  static Int(data?: QueryOptions) {
    return applyDecorators(
      ApiProperty({
        required: data?.required,
        type: Number,
        isArray: data?.isArray,
      }),
      data?.required ? IsDefined() : IsOptional(),
      IsInt({ each: data?.isArray }),
      Type(() => Number),
    );
  }

  static Number(data?: QueryOptions) {
    return applyDecorators(
      ApiProperty({
        required: data?.required,
        type: Number,
        isArray: data?.isArray,
      }),
      data?.required ? IsDefined() : IsOptional(),
      IsNumber(data.numOpt, { each: data?.isArray }),
      Type(() => Number),
    );
  }

  static String(data?: QueryOptions) {
    return applyDecorators(
      ApiProperty({
        required: data?.required,
        type: String,
        isArray: data?.isArray,
      }),
      data?.required ? IsDefined() : IsOptional(),
      IsString({ each: data?.isArray }),
    );
  }

  static Email(data?: QueryOptions) {
    return applyDecorators(
      ApiProperty({
        required: data?.required,
        type: String,
        isArray: data?.isArray,
      }),
      data?.required ? IsDefined() : IsOptional(),
      IsEmail({ each: data?.isArray }),
    );
  }

  static Phone(data?: QueryOptions) {
    return applyDecorators(
      ApiProperty({
        required: data?.required,
        type: String,
        isArray: data?.isArray,
      }),
      data?.required ? IsDefined() : IsOptional(),
      IsPhoneNumber(),
    );
  }

  static Enum(data?: QueryOptions) {
    return applyDecorators(
      ApiProperty({
        required: data?.required,
        type: data?.enumType,
        isArray: data?.isArray,
      }),
      data?.required ? IsDefined() : IsOptional(),
      IsEnum(data?.enumType, { each: data?.isArray }),
    );
  }

  static Date(data?: QueryOptions) {
    return applyDecorators(
      ApiProperty({
        required: data?.required,
        type: Date,
        isArray: data?.isArray,
      }),
      data?.required ? IsDefined() : IsOptional(),
      IsDate({ each: data?.isArray }),
      Type(() => Date),
    );
  }
}
