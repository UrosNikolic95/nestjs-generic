import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUserController } from './auth-user.controller';
import { AuthUserModule } from './auth-user.module';
import { databaseConfig } from '../../../data/database.config';
import { closeBull } from '../../helpers/bull.helper';

describe('AuthController', () => {
  let controller: AuthUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthUserModule, TypeOrmModule.forRoot(databaseConfig)],
    }).compile();

    controller = module.get<AuthUserController>(AuthUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
