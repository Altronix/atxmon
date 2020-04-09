import { Bcrypt } from "../common/bcrypt";
import { Logger as LoggerImpl } from "../common/logger";
import { Utils as UtilsImpl } from "../common/utils";
import { SYMBOLS } from "./constants";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";

import { ContainerModule, AsyncContainerModule } from "inversify";

const commonBindings = new ContainerModule(bind => {
  bind<CryptoRoutines>(SYMBOLS.CRYPTO_ROUTINES)
    .to(Bcrypt)
    .inSingletonScope();

  bind<LoggerRoutines>(SYMBOLS.LOGGER_ROUTINES)
    .to(LoggerImpl)
    .inSingletonScope();

  bind<UtilRoutines>(SYMBOLS.UTIL_ROUTINES)
    .to(UtilsImpl)
    .inSingletonScope();
});

export default commonBindings;
