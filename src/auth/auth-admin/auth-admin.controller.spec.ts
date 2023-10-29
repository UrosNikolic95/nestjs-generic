import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../../data/database.config';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminModule } from './auth-admin.module';

describe('AuthController', () => {
  let controller: AuthAdminService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthAdminModule, TypeOrmModule.forRoot(databaseConfig)],
    }).compile();

    controller = module.get<AuthAdminService>(AuthAdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
  });
});
