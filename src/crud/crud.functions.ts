import { DeepPartial, Repository } from 'typeorm';
import { RequestManyDto } from './crud.dto';
import {
  EntityType,
  IGenericController,
  IPaginationResponse,
} from './crud.interface';
import { csvString } from './crud.helper';

export class GenericFunctions<T extends EntityType>
  implements IGenericController<T>
{
  constructor(private readonly repo: Repository<T>) {}

  async requestMany(query: RequestManyDto): Promise<IPaginationResponse<T>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const [items, count] = await this.repo
      .createQueryBuilder('root')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    return {
      items,
      count,
      page,
      limit,
    };
  }

  async export(): Promise<string> {
    const items = await this.repo.createQueryBuilder('root').getMany();
    return csvString(items);
  }

  async requestOne(id: number): Promise<T> {
    return this.repo.createQueryBuilder('root').where({ id }).getOne();
  }
  async create(body: DeepPartial<T>): Promise<T> {
    return this.repo.save(body);
  }

  async delete(id: number): Promise<T> {
    const found = await this.repo
      .createQueryBuilder('root')
      .where({ id })
      .getOne();
    await found.remove();
    return { ...found, id };
  }

  async update(id: number, body: DeepPartial<T>): Promise<T> {
    const find = await this.repo
      .createQueryBuilder('root')
      .where({ id })
      .getOne();
    return Object.assign(find, body).save();
  }
}
