import { snakeCase } from "snake-case";
import { camelCase } from "camel-case";

function transform<T>(obj: any, op: (s: string) => string) {
  let ret: any = {};
  Object.keys(obj).forEach(k => {
    const t = typeof obj[k];
    if (t === "string" || t === "number" || t === "boolean") {
      ret[op(k)] = obj[k];
    } else if (
      t === "object" ||
      t === "undefined" ||
      t === "symbol" ||
      t === "function"
    ) {
      ret[k] = obj[k];
    }
  });
  return (ret as any) as T;
}

export function toSnakeCase<T>(obj: any): T {
  return transform(obj, snakeCase);
}

export function toCamelCase<T>(obj: any): T {
  return transform(obj, camelCase);
}
