export function getClassDecoratorHelper<T>(key: string) {
  return {
    get(obj: Object): T {
      return Reflect.getMetadata(key, Object.getPrototypeOf(obj).constructor);
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
      return Reflect.getMetadata(
        key,
        Object.getPrototypeOf(obj).constructor,
        field,
      );
    },

    set(value: T): PropertyDecorator {
      return (target, field) => {
        Reflect.defineMetadata(key, value, target, field);
      };
    },
  };
}
