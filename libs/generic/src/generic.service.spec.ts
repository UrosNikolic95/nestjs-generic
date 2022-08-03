import { Test, TestingModule } from '@nestjs/testing';
import { getConnection, TestEntity } from '../testing/connection';
import { RequestManyDto } from './generic.dto';
import { GenericFunctions } from './generic.functions';

describe('GenericFuntions', async () => {
  const connection = await getConnection();

  const service = new GenericFunctions(connection.getRepository(TestEntity));
  let data0: TestEntity;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('data be defined', async () => {
    data0 = await service.create({ field: 'abc' });
    expect(data0).toBeDefined();
  });

  it('find me', async () => {
    const data1 = await service.requestOne(data0.id);
    expect(data1.id).toEqual(data0.id);
  });

  it('test limit', async () => {
    const data2 = await service.requestMany({
      limit: 1,
      page: 1,
    } as RequestManyDto);
    expect(data2.items).toEqual(data2.limit);
  });

  it('test delete', async () => {
    const data3 = await service.delete(data0.id);
    expect(data3.id).toEqual(data0.id);
  });
});
