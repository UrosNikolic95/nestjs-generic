import { DataSource } from 'typeorm';
import { getConnection } from '../../test/data/connection';
import { Test1Entity } from '../../test/data/test1.entity';
import { RequestManyDto } from './crud.dto';
import { GenericFunctions } from './crud.functions';

describe('GenericFuntions', () => {
  let connection: DataSource;
  let service: GenericFunctions<Test1Entity>;
  let data0: Test1Entity;

  beforeAll(async () => {
    connection = await getConnection();
    service = new GenericFunctions(connection.getRepository(Test1Entity));
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
    expect(data3.id).toEqual(data0.id);
  });

  afterAll(async () => {
    await connection.destroy();
  });
});
