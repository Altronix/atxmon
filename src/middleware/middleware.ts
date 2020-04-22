import { LoggerMiddleware } from "./logger.middleware";
import { ExpectJsonMiddleware } from "./expect-json.middleware";
import { DeviceExistsMiddleware } from "./device-exists.middleware";
import { BodyParserMiddleware } from "./body-parser.middleware";
import { CookieParserMiddleware } from "./cookie-parser.middleware";

export const StandardMiddleware = [
  BodyParserMiddleware,
  LoggerMiddleware,
  ExpectJsonMiddleware,
  CookieParserMiddleware
];
