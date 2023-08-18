import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as dotenv from 'dotenv';
dotenv.config();
import * as cookieParser from 'cookie-parser';
import { envConfig } from './config';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(envConfig.SWAGGER_TITLE)
    .setDescription(envConfig.SWAGGER_DESCRIPTION)
    .setVersion(envConfig.SWAGGER_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(envConfig.SWAGGER_PATH, app, document);
}

export async function bootstrapInit(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());
  app.use(
    session({
      secret: envConfig.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.setGlobalPrefix(envConfig.GLOBAL_PREFIX);
  setupSwagger(app);
}
