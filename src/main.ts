import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { bootstrapInit } from '.';
import { AppModule } from '../test/data/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  bootstrapInit(app);

  await app.listen(3001);
}
bootstrap();
