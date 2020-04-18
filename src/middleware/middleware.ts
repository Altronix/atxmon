import { LoggerMiddleware } from "./logger.middleware";
import { ExpectJsonMiddleware } from "./expect-json.middleware";
import { DeviceExistsMiddleware } from "./device-exists.middleware";
import { BodyParserMiddleware } from "./body-parser.middleware";

export const StandardMiddleware = [
  ExpectJsonMiddleware,
  BodyParserMiddleware,
  LoggerMiddleware
];
