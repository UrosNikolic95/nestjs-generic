import { BaseEntity, DeepPartial } from 'typeorm';
import { RequestManyDto } from './crud.dto';

export type EntityType = { id: number } & BaseEntity;

export interface IGenericController<T extends EntityType> {
  requestMany(query: RequestManyDto): Promise<IPaginationResponse<T>>;
  requestOne(id: number): Promise<T>;
  create(body: DeepPartial<T>): Promise<T>;
  delete(id: number): Promise<T>;
  update(id: number, body: DeepPartial<T>): Promise<T>;
}

export interface IPaginationResponse<T> {
  items: T[];

  count: number;

  page: number;

  limit: number;
}
