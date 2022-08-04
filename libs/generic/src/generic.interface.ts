import { BaseEntity, DeepPartial } from 'typeorm';
import { RequestManyDto, RequestManyResponeDto } from './generic.dto';

export type EntityType = { id: number } & BaseEntity;

export interface IGenericController<T extends EntityType> {
  requestMany(query: RequestManyDto): Promise<RequestManyResponeDto<T>>;
  requestOne(id: number): Promise<T>;
  create(body: DeepPartial<T>): Promise<T>;
  delete(id: number): Promise<T>;
  update(id: number, body: DeepPartial<T>): Promise<T>;
}
