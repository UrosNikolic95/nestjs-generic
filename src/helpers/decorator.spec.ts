import 'reflect-metadata';
import {
  getClassDecoratorHelper,
  getFielListDecorator,
} from './decorator.helper';

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

  const dec2 = getFielListDecorator('fields');

  class A2 {
    @dec2.set()
    field1: 1;

    @dec2.set()
    field2: 1;
  }

  const obj3 = new A2();
  const val3 = dec2.get(obj3);

  it('test decorator 3 a', () => {
    expect(val3).toBeDefined();
  });

  it('test decorator 3 b', () => {
    expect(val3.length).toBe(2);
  });

  it('test decorator 3 c', () => {
    expect(val3[0]).toBe('field1');
  });
});
