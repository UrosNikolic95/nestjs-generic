import { Type } from '@nestjs/common';

export function getFunctionNames(obj: any) {
  const functionNames: string[] = [];
  let current = obj;
  do {
    functionNames.push(...Object.getOwnPropertyNames(current));
    current = Object.getPrototypeOf(current);
  } while (current);
  return Array.from(new Set(functionNames));
}

const defaultFunctions = getFunctionNames({});

export function getNonDefaultFunctionNames(obj: any) {
  const defaultFunctionsSet = new Set(defaultFunctions);
  return getFunctionNames(obj).filter((el) => !defaultFunctionsSet.has(el));
}

export interface ITimedFunctions {
  [key: string]: ITimedFunction;
}

export interface ITimedFunction {
  total_time: number;
  total_runs: number;
}

export const times = {} as ITimedFunctions;

function vrap(className: string, functionName: string, oldFunc: Function) {
  return (...args: any[]) => {
    const timestamp = Date.now();
    const res = oldFunc(...args);
    const key = className + '.' + functionName;
    if (!times[key])
      times[key] = {
        total_runs: 0,
        total_time: 0,
      };
    times[key].total_runs++;
    times[key].total_time += Date.now() - timestamp;
    return res;
  };
}

export function insertFunctions(obj: any) {
  const prototype = Object.getPrototypeOf(obj);
  const className = prototype?.constructor?.name;
  getNonDefaultFunctionNames(obj).forEach((functionName) => {
    const func = obj[functionName];
    obj[functionName] = vrap(className, functionName, func);
  });
}

export function Encapsulate(): MethodDecorator {
  return (
    target: Type<any>,
    field: any,
    desc: TypedPropertyDescriptor<any>,
  ) => {
    const className = target?.constructor?.name;
    const func = desc.value;
    desc.value = vrap(className, field, func);
  };
}
