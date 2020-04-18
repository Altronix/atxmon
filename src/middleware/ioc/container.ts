import { LoggerMiddleware } from "../logger.middleware";
import { DeviceExistsMiddleware } from "../device-exists.middleware";
import { ExpectJsonMiddleware } from "../expect-json.middleware";
import { BodyParserMiddleware } from "../body-parser.middleware";
import { SYMBOLS } from "../../ioc/constants.root";
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
  bind<LoggerMiddleware>(LoggerMiddleware).toSelf();
  bind<DeviceExistsMiddleware>(DeviceExistsMiddleware).toSelf();
  bind<ExpectJsonMiddleware>(ExpectJsonMiddleware).toSelf();
  bind<BodyParserMiddleware>(BodyParserMiddleware).toSelf();
});
