import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUserModule } from './auth.module';
import { AuthUserService } from './auth-user.service';
import { databaseConfig } from '../../../data/database.config';
import { closeBull } from '../../helpers/bull.helper';

describe('AuthService', () => {
  let service: AuthUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(databaseConfig), AuthUserModule],
    }).compile();

    service = module.get<AuthUserService>(AuthUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
