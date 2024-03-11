import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
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

interface EnvOptions {
  required?: boolean;
  isArray?: boolean;
  numOpt?: IsNumberOptions;
  enumType?: any;
}

export class EnvDecorators {
  static Int(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsInt({ each: data?.isArray }),
      Type(() => Number),
    );
  }

  static Number(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsNumber(data.numOpt, { each: data?.isArray }),
      Type(() => Number),
    );
  }

  static String(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsString({ each: data?.isArray }),
    );
  }

  static Email(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsEmail({ each: data?.isArray }),
    );
  }

  static Phone(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsPhoneNumber(),
    );
  }

  static Enum(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsEnum(data?.enumType, { each: data?.isArray }),
    );
  }

  static Date(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsDate({ each: data?.isArray }),
      Type(() => Date),
    );
  }

  static Boolean(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsBoolean({ each: data?.isArray }),
      Transform((o) =>
        typeof o.value == 'string'
          ? o.value?.toLocaleLowerCase() == 'true'
          : o.value,
      ),
    );
  }
}
