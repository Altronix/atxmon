import { SYMBOLS as UTIL_SYMBOLS } from "../common/ioc/constants";
import { SYMBOLS as DATABASE_SYMBOLS } from "../database/ioc/constants";
import { SYMBOLS as LINQ_SYMBOLS } from "../linq/ioc/constants";
import { SYMBOLS as CONTROLLER_SYMBOLS } from "../controllers/ioc/constants";

export const SYMBOLS = Object.assign(
  DATABASE_SYMBOLS,
  UTIL_SYMBOLS,
  LINQ_SYMBOLS,
  CONTROLLER_SYMBOLS
);
