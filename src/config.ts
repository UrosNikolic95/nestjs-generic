import { Type, plainToClass } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsPhoneNumber,
  IsString,
  validateSync,
} from 'class-validator';
import * as dotenv from 'dotenv';
dotenv.config();

export class EnvVariables {
  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_EXPIRES: string;

  @IsString()
  FORGOT_PASSWORD_LINK: string;

  @IsString()
  DB_URL: string;
  @IsString()
  USERS_DB_URL: string;

  @IsString()
  REDIS_HOST: string;
  @Type(() => Number)
  @IsInt()
  REDIS_PORT: number;
  @IsString()
  REDIS_PASS: string;

  @IsString()
  SMTP_HOST: string;
  @Type(() => Number)
  @IsInt()
  SMTP_PORT: number;
  @IsEmail()
  SMTP_USER: string;
  @IsString()
  SMTP_PASS: string;
  @IsEmail()
  SMTP_FROM: string;

  @IsString()
  SWAGGER_TITLE: string;
  @IsString()
  SWAGGER_DESCRIPTION: string;
  @IsString()
  SWAGGER_PATH: string;
  @IsString()
  SWAGGER_VERSION: string;

  @IsString()
  GLOBAL_PREFIX: string;

  @IsString()
  TWILIO_ACCOUNT_SID: string;
  @IsString()
  TWILIO_AUTH_TOKEN: string;
  @IsPhoneNumber()
  TWILIO_PHONE_NUMBER: string;
  @IsString()
  TWILIO_PHONE_NUMBER_TO: string;
}

function init() {
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

export const envConfig = init();
