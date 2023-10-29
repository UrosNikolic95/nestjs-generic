import { Test, TestingModule } from '@nestjs/testing';
import { PhoneModule } from './phone.module';
import { PhoneService } from './phone.service';
import { async } from 'rxjs';
import { envConfig } from '../config';
import { nextTick } from 'process';

describe('phone module test', () => {
  let module: TestingModule;
  let phoneService: PhoneService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PhoneModule],
    }).compile();
    phoneService = module.get<PhoneService>(PhoneService);
  });

  it('send text', async () => {
    const p = phoneService.send({
      phone: envConfig.TWILIO_PHONE_NUMBER_TO,
      message: 'text test',
    });
    await expect(p).resolves.not.toThrowError();
  });

  afterAll(async () => {
    await module.close();
  });
});
