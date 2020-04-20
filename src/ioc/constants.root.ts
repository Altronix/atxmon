import { SYMBOLS as UTIL_SYMBOLS } from "../common/ioc/constants";
import { SYMBOLS as DATABASE_SYMBOLS } from "./services-constants";
import { SYMBOLS as CONTROLLER_SYMBOLS } from "../controllers/ioc/constants";
import { SYMBOLS as MIDDLEWARE_SYMBOLS } from "./middleware-constants";

export const SYMBOLS = Object.assign(
  DATABASE_SYMBOLS,
  UTIL_SYMBOLS,
  CONTROLLER_SYMBOLS,
  MIDDLEWARE_SYMBOLS
);

export const METADATA_KEY = {
  controller: "altronix/controller",
  controllerMethod: "altronix/controllerMethod"
};
