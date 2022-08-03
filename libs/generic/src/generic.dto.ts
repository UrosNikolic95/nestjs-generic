export class RequestManyDto {
  page: number;
  limit: number;

  get skip() {
    return (this.page - 1) * this.limit;
  }

  get take() {
    return this.limit;
  }
}

export class RequestManyResponeDto<T> {
  constructor(obj: RequestManyResponeDto<T>) {
    Object.assign(this, obj);
  }

  items: T[];
  count: number;
  page: number;
  limit: number;
}
