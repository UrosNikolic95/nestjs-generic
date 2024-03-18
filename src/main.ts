import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { bootstrapInit } from '.';
import { AppModule } from '../test/data/app.module';
import { EnvDecorators } from './decorators/env.decorators';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error'] });

  bootstrapInit(app);

  await app.listen(3001);
  EnvDecorators.PrintEnvExample();
}
bootstrap();
