import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAdminService } from './auth-admin.service';
import { databaseConfig } from '../../../data/database.config';

describe('AuthService', () => {
  let service: AuthAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(databaseConfig)],
    }).compile();

    service = module.get<AuthAdminService>(AuthAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
