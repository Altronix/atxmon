import { snakeCase } from "snake-case";

export function toSnakeCase<T>(obj: any): T {
  let ret: any = {};
  Object.keys(obj).forEach(k => {
    const t = typeof obj[k];
    if (t === "string" || t === "number" || t === "boolean") {
      ret[snakeCase(k)] = obj[k];
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
