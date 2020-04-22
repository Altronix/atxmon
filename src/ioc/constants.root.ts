import { SYMBOLS as UTIL_SYMBOLS } from "./common-constants";
import { SYMBOLS as DATABASE_SYMBOLS } from "./services-constants";
import { SYMBOLS as CONTROLLER_SYMBOLS } from "./controllers-constants";
import { SYMBOLS as APP_SYMBOLS } from "./app-constants";

export const SYMBOLS = Object.assign(
  DATABASE_SYMBOLS,
  UTIL_SYMBOLS,
  CONTROLLER_SYMBOLS,
  APP_SYMBOLS
);

export const METADATA_KEY = {
  middlware: "altronix/middleware",
  controller: "altronix/controller",
  controllerMethod: "altronix/controllerMethod"
};
