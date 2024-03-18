import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as dotenv from 'dotenv';
import { EnvDecorators } from './decorators/env.decorators';
dotenv.config();

export class EnvVariables {
  @EnvDecorators.String()
  JWT_SECRET: string;
  @EnvDecorators.String()
  JWT_EXPIRES: string;

  @EnvDecorators.String()
  FORGOT_PASSWORD_LINK: string;

  @EnvDecorators.String()
  DB_URL: string;
  @EnvDecorators.String()
  USERS_DB_URL: string;
  @EnvDecorators.String()
  USER_DB_NAME = 'default';

  @EnvDecorators.String()
  REDIS_HOST: string;
  @EnvDecorators.Int()
  REDIS_PORT: number;
  @EnvDecorators.String()
  REDIS_PASS: string;

  @EnvDecorators.String()
  SMTP_HOST: string;
  @EnvDecorators.Number()
  SMTP_PORT: number;
  @EnvDecorators.Email()
  SMTP_USER: string;
  @EnvDecorators.String()
  SMTP_PASS: string;
  @EnvDecorators.Email()
  SMTP_FROM: string;

  @EnvDecorators.Boolean({ required: false })
  SWAGGER_SETUP: boolean;
  @EnvDecorators.String({ required: false })
  SWAGGER_TITLE: string;
  @EnvDecorators.String({ required: false })
  SWAGGER_DESCRIPTION: string;
  @EnvDecorators.String()
  SWAGGER_PATH: string = 'api/docs';
  @EnvDecorators.String({ required: false })
  SWAGGER_VERSION: string;

  @EnvDecorators.String({ required: false })
  GLOBAL_PREFIX: string;

  @EnvDecorators.String()
  TWILIO_ACCOUNT_SID: string;
  @EnvDecorators.String()
  TWILIO_AUTH_TOKEN: string;
  @EnvDecorators.Phone()
  TWILIO_PHONE_NUMBER: string;
  @EnvDecorators.String()
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
