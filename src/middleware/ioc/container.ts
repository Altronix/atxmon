import { LoggerMiddleware } from "../logger.middleware";
import { DeviceExistsMiddleware } from "../device-exists.middleware";
import { SYMBOLS } from "../../ioc/constants.root";
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
  bind<LoggerMiddleware>(LoggerMiddleware).toSelf();
  bind<DeviceExistsMiddleware>(DeviceExistsMiddleware).toSelf();
});
