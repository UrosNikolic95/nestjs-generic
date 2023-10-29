import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUserModule } from './auth-user.module';
import { AuthUserService } from './auth-user.service';
import { databaseConfig } from '../../../data/database.config';
import { async } from 'rxjs';

describe('AuthService', () => {
  let service: AuthUserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(databaseConfig), AuthUserModule],
    }).compile();

    service = module.get<AuthUserService>(AuthUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
  });
});
