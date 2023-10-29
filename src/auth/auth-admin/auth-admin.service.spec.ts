import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAdminService } from './auth-admin.service';
import { databaseConfig } from '../../../data/database.config';
import { AuthAdminModule } from './auth-admin.module';

describe('AuthService', () => {
  let service: AuthAdminService;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(databaseConfig), AuthAdminModule],
    }).compile();

    service = module.get<AuthAdminService>(AuthAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
  });
});
