import { LoggerMiddleware } from "../logger.middleware";
import { SYMBOLS } from "../../ioc/constants.root";
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
  bind<LoggerMiddleware>(SYMBOLS.MIDDLEWARE_LOGGER).to(LoggerMiddleware);
});
