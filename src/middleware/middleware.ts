import { LoggerMiddleware } from "./logger.middleware";
import { ExpectJsonMiddleware } from "./expect-json.middleware";
import { DeviceExistsMiddleware } from "./device-exists.middleware";
import { BodyParserMiddleware } from "./body-parser.middleware";
import { CookieParserMiddleware } from "./cookie-parser.middleware";
import { ValidUserMiddleware } from "./valid-user.middleware";
import { IsAdminMiddleware } from "./is-admin.middleware";

export const StandardMiddleware = [
  ExpectJsonMiddleware,
  BodyParserMiddleware,
  LoggerMiddleware,
  CookieParserMiddleware
];

export const IsAdmin = [ValidUserMiddleware, IsAdminMiddleware];
