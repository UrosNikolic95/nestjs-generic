import { Controller, Get, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHelper, Select, SelectSpecific } from 'type-safe-select';
import { Repository } from 'typeorm';

export function getViewerController<T, result>(
  name: string,
  startingPoint: Type<T>,
  select: SelectSpecific<T, result>,
): Type {
  @Controller(name)
  class ViewController {
    helper: QueryHelper<T>;

    constructor(
      @InjectRepository(startingPoint)
      repo: Repository<T>,
    ) {
      this.helper = new QueryHelper(repo);
    }

    @Get()
    async getMany() {
      return this.helper.selectSpecific(select);
    }
  }
  return ViewController;
}
