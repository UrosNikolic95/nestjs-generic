import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../../data/database.config';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminModule } from './auth-admin.module';

describe('AuthController', () => {
  let controller: AuthAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthAdminModule, TypeOrmModule.forRoot(databaseConfig)],
    }).compile();

    controller = module.get<AuthAdminService>(AuthAdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
