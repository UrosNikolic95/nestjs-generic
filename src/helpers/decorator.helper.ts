export function getClassDecoratorHelper<T>(key: string) {
  return {
    get(obj: Object): T {
      return Reflect.getMetadata(key, obj.constructor);
    },

    set(value: T): ClassDecorator {
      return (target) => {
        Reflect.defineMetadata(key, value, target);
      };
    },
  };
}

export function getFieldDecoratorHelper<T>(key: string) {
  return {
    get(obj: Object, field: string): T {
      return Reflect.getMetadata(key, obj.constructor, field);
    },

    set(value: T): PropertyDecorator {
      return (target, field) => {
        Reflect.defineMetadata(key, value, target, field);
      };
    },
  };
}

export function getFielListDecorator(key: string) {
  return {
    get(obj: Object): string[] {
      return Reflect.getMetadata(key, obj) || [];
    },

    set(): PropertyDecorator {
      return (target, property: string) => {
        const arr = Reflect.getMetadata(key, target) as string[];
        if (arr) {
          arr.push(property);
        } else {
          Reflect.defineMetadata(key, [property], target);
        }
      };
    },
  };
}

export function getObjectDecorator<T>(key: string) {
  return {
    get(obj: Object): { [key: string]: T } {
      return Reflect.getMetadata(key, obj) || {};
    },

    set(val: T): PropertyDecorator {
      return (target, property: string) => {
        const obj = Reflect.getMetadata(key, target) as any;
        if (obj) {
          obj[property] = val;
        } else {
          Reflect.defineMetadata(key, { [property]: val }, target);
        }
      };
    },
  };
}
