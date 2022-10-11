import { getFunctionNames, getNonDefaultFunctionNames } from './handy.helpers';

describe('handy.helpers', () => {
  class A0 {
    f1() {
      return 'f1';
    }
    f2() {
      return 'f2';
    }
    f3() {
      return 'f3';
    }
  }

  class A1 extends A0 {
    f4() {
      return 'f4';
    }
    f5() {
      return 'f5';
    }
    f6() {
      return 'f6';
    }
  }

  it('getNonDefaultFunctionNames', () => {
    const obj = new A1();
    const funcNames = getNonDefaultFunctionNames(obj);
    console.log(funcNames, getFunctionNames(obj));

    expect(funcNames.length).toEqual(6);
  });
});
