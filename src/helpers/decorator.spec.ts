import 'reflect-metadata';
import { getClassDecoratorHelper } from './decorator.helper';

describe('decorator.helper', () => {
  const dec = getClassDecoratorHelper<{ field1: number }>('test');
  const setDec = dec.set;
  const getDec = dec.get;

  @dec.set({ field1: 1 })
  class A0 {}
  const obj1 = new A0();
  const val1 = dec.get(obj1);

  it('test decorator 1 a', () => {
    expect(val1).toBeDefined();
  });

  it('test decorator 1 b', () => {
    expect(val1.field1).toBe(1);
  });

  @setDec({ field1: 1 })
  class A1 {}

  const obj2 = new A1();
  const val2 = getDec(obj2);

  it('test decorator 2 a', () => {
    expect(val2).toBeDefined();
  });

  it('test decorator 2 b', () => {
    expect(val2.field1).toBe(1);
  });
});
