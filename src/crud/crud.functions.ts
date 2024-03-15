import { DeepPartial, Repository } from 'typeorm';
import { RequestManyDto } from './crud.dto';
import {
  EntityType,
  IGenericController,
  IPaginationResponse,
} from './crud.interface';
import { csvResXlsx, fromBufferToJson } from './crud.helper';
import { Response } from 'express';

export class GenericFunctions<T extends EntityType>
  implements IGenericController<T>
{
  constructor(private readonly repo: Repository<T>) {}

  async requestMany(query: RequestManyDto): Promise<IPaginationResponse<T>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const [items, count] = await this.repo.findAndCount({
      skip,
      take: limit,
    });

    return {
      items: items,
      count,
      page,
      limit,
    };
  }

  async import(file: Express.Multer.File) {
    const data = fromBufferToJson(file, this.repo.target);
    const saved = await this.repo.save(data);
    return saved;
  }

  async export(res: Response) {
    const items = await this.repo.createQueryBuilder('root').getMany();
    csvResXlsx(res, items);
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
