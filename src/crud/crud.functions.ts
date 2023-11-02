import { DeepPartial, Repository } from 'typeorm';
import { RequestManyDto } from './crud.dto';
import {
  EntityType,
  IGenericController,
  IPaginationResponse,
} from './crud.interface';
import { csvRes } from './crud.helper';
import { Response } from 'express';
import { QueryHelper, Where, Flatten } from 'type-safe-select';

export class GenericFunctions<T extends EntityType, query = any>
  implements IGenericController<T>
{
  constructor(
    private readonly repo: Repository<T>,
    readonly queryParams: (el: any) => Where<Flatten<T>>,
  ) {}

  async requestMany(query: RequestManyDto): Promise<IPaginationResponse<T>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const [items, count] = await new QueryHelper(this.repo).getManyAndCount({
      where: this.queryParams(query),
      skip,
      take: limit,
    });
    return {
      items,
      count,
      page,
      limit,
    };
  }

  async export(res: Response) {
    const items = await this.repo.createQueryBuilder('root').getMany();
    csvRes(res, items);
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
