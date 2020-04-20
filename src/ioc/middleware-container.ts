import { LoggerMiddleware } from "../middleware/logger.middleware";
import { DeviceExistsMiddleware } from "../middleware/device-exists.middleware";
import { ExpectJsonMiddleware } from "../middleware/expect-json.middleware";
import { BodyParserMiddleware } from "../middleware/body-parser.middleware";
import { SYMBOLS } from "./constants.root";
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
  bind<LoggerMiddleware>(LoggerMiddleware).toSelf();
  bind<DeviceExistsMiddleware>(DeviceExistsMiddleware).toSelf();
  bind<ExpectJsonMiddleware>(ExpectJsonMiddleware).toSelf();
  bind<BodyParserMiddleware>(BodyParserMiddleware).toSelf();
});
