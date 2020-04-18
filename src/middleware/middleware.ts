import { LoggerMiddleware } from "./logger.middleware";
import { ExpectJsonMiddleware } from "./default-content-type.middleware";
import { DeviceExistsMiddleware } from "./device-exists.middleware";
import { BodyParserMiddleware } from "./body-parser.middleware";

export const GlobalMiddleware = [
  ExpectJsonMiddleware,
  BodyParserMiddleware,
  LoggerMiddleware
];
