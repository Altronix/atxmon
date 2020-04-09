import { SYMBOLS as UTIL_SYMBOLS } from "./common.constants";
import { SYMBOLS as DATABASE_SYMBOLS } from "./database.constants";
import { SYMBOLS as LINQ_SYMBOLS } from "./linq.constants";

export const SYMBOLS = Object.assign(
  {},
  DATABASE_SYMBOLS,
  UTIL_SYMBOLS,
  LINQ_SYMBOLS
);
