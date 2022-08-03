import { DeepPartial, Repository } from 'typeorm';
import { RequestManyDto, RequestManyResponeDto } from './generic.dto';
import { EntityType, IGenericController } from './generic.interface';

export class GenericFunctions<T extends EntityType>
  implements IGenericController<T>
{
  constructor(private readonly repo: Repository<T>) {}

  async requestMany(query: RequestManyDto): Promise<RequestManyResponeDto<T>> {
    const { skip, take, page, limit } = query;
    const [items, count] = await this.repo
      .createQueryBuilder('root')
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return new RequestManyResponeDto<T>({
      items,
      count,
      page,
      limit,
    });
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

  async update(body: DeepPartial<T>): Promise<T> {
    return this.repo.save(body);
  }
}
