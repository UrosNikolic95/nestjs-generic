import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToClass } from 'class-transformer';
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
  validateSync,
} from 'class-validator';
import { getObjectDecorator } from '../helpers/decorator.helper';
import { EnvVariables } from '../config';
import { writeFileSync } from 'fs';

interface EnvOptions {
  required?: boolean;
  isArray?: boolean;
  numOpt?: IsNumberOptions;
  enumType?: any;
}

const envData: { [key: string]: string } = {};
function EnvExample(value: string): PropertyDecorator {
  return (target: any, property: string) => {
    envData[property] = value;
  };
}

export class EnvDecorators {
  static Int(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsInt({ each: data?.isArray }),
      Type(() => Number),
      EnvExample(`<int-${data?.required ? 'required' : 'optional'}>`),
    );
  }

  static Number(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsNumber(data?.numOpt, { each: data?.isArray }),
      Type(() => Number),
      EnvExample(`<number-${data?.required ? 'required' : 'optional'}>`),
    );
  }

  static String(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsString({ each: data?.isArray }),
      EnvExample(`<string-${data?.required ? 'required' : 'optional'}>`),
    );
  }

  static Email(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsEmail({ each: data?.isArray }),
      EnvExample(`<email-${data?.required ? 'required' : 'optional'}>`),
    );
  }

  static Phone(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsPhoneNumber(),
      EnvExample(`<phone-${data?.required ? 'required' : 'optional'}>`),
    );
  }

  static Enum(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsEnum(data?.enumType, { each: data?.isArray }),
      EnvExample(
        `<enum-${data?.required ? 'required' : 'optional'}-${data?.enumType}>`,
      ),
    );
  }

  static Date(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsDate({ each: data?.isArray }),
      Type(() => Date),
      EnvExample(
        `<date-${data?.required ? 'required' : 'optional'}-${data?.enumType}>`,
      ),
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
      EnvExample(
        `<${[
          'boolean',
          data?.required ? 'required' : 'optional',
          data?.enumType,
        ]
          .filter((el) => el)
          .join('-')}>`,
      ),
    );
  }

  static init() {
    const data = plainToClass(EnvVariables, process.env);
    const err = validateSync(data, {
      whitelist: true,
    });
    if (err.length) {
      console.error(err);
      throw new Error();
    }
    return data;
  }

  static PrintEnvExample(fileName = '.env.example.generated') {
    writeFileSync(
      fileName,
      Object.keys(envData)
        .map((key) => `${key}=${envData[key]}`)
        .join('\n'),
    );
  }
}
