import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUserController } from './auth-user.controller';
import { AuthUserModule } from './auth-user.module';
import { databaseConfig } from '../../../data/database.config';

describe('AuthController', () => {
  let controller: AuthUserController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthUserModule, TypeOrmModule.forRoot(databaseConfig)],
    }).compile();

    controller = module.get<AuthUserController>(AuthUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
  });
});
