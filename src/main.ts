import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './main.helpers';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { jwtSecret } from '../libs/generic/src/consts/consts';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());
  app.use(
    session({
      secret: jwtSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.setGlobalPrefix('api');
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
