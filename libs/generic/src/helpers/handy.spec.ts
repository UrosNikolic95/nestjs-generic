import {
  Encapsulate,
  getFunctionNames,
  getNonDefaultFunctionNames,
  insertFunctions,
  times,
} from './handy.helpers';

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
    f4(a: number, b: number) {
      return 'f4' + (a + b);
    }
    f5() {
      return 'f5';
    }
    f6() {
      return 'f6';
    }
  }

  class A2 {
    @Encapsulate()
    f7(str: string) {
      return 'f7' + str;
    }
  }

  it('getNonDefaultFunctionNames number of found functions', () => {
    const obj = new A1();
    const funcNames = getNonDefaultFunctionNames(obj);
    expect(funcNames.length).toEqual(6);
  });

  it('getNonDefaultFunctionNames return value check', () => {
    const obj = new A1();
    insertFunctions(obj);
    const res = obj.f1();
    expect(res).toEqual('f1');
  });

  it('getNonDefaultFunctionNames total_runs f2', () => {
    const obj = new A1();
    insertFunctions(obj);
    obj.f2();
    expect(times['A1.f1'].total_runs).toEqual(1);
  });

  it('insertFunctions total_runs f3', () => {
    const obj = new A1();
    insertFunctions(obj);
    obj.f3();
    obj.f3();
    obj.f3();
    expect(times['A1.f3'].total_runs).toEqual(3);
  });

  it('insertFunctions passing parameters', () => {
    const obj = new A1();
    insertFunctions(obj);
    const res = obj.f4(1, 2);
    expect(res).toEqual('f43');
  });

  it('vrap function decorator', () => {
    const obj = new A2();
    const res = obj.f7('?');
    expect(res).toEqual('f7?');
  });

  it('vrap function decorator', () => {
    const obj = new A2();
    obj.f7('?');
    expect(times['A2.f7'].total_runs).toEqual(2);
  });
});
