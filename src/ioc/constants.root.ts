import { SYMBOLS as UTIL_SYMBOLS } from "../common/ioc/ioc_constants";
import { SYMBOLS as DATABASE_SYMBOLS } from "../database/ioc/ioc_constants";
import { SYMBOLS as LINQ_SYMBOLS } from "../linq/ioc/ioc_constants";

export const SYMBOLS = Object.assign(
  {},
  DATABASE_SYMBOLS,
  UTIL_SYMBOLS,
  LINQ_SYMBOLS
);
