export function isObject<T = object>(candidate: any): candidate is T {
  return typeof candidate === 'object' && candidate !== null;
}

export function isBoolean(candidate: any): candidate is boolean {
  return typeof candidate === 'boolean';
}

export function isString(candidate: any): candidate is string {
  return typeof candidate === 'string';
}

export function isNumber(candidate: any): candidate is number {
  return typeof candidate === 'number';
}

// tslint:disable-next-line: ban-types
export function isFunction<T = Function>(candidate: any): candidate is T {
  return typeof candidate === 'function';
}

export function isArray<T = any>(candidate: any): candidate is T[] {
  return Array.isArray(candidate);
}
