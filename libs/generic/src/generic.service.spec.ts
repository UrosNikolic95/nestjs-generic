import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { getConnection, TestEntity } from '../testing/connection';
import { RequestManyDto } from './generic.dto';
import { GenericFunctions } from './generic.functions';
import { EntityType } from './generic.interface';

describe('GenericFuntions', () => {
  let connection: DataSource;
  let service: GenericFunctions<TestEntity>;
  let data0: TestEntity;

  beforeAll(async () => {
    connection = await getConnection();
    service = new GenericFunctions(connection.getRepository(TestEntity));
  });

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
    expect(data2.items.length).toEqual(data2.limit);
  });

  it('test delete', async () => {
    const data3 = await service.delete(data0.id);
    console.log({ data3 });
    expect(data3.id).toEqual(data0.id);
  });

  afterAll(async () => {
    await connection.destroy();
  });
});
