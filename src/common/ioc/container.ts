import { Bcrypt } from "../bcrypt";
import { Logger as LoggerImpl } from "../logger";
import { Utils as UtilsImpl } from "../utils";
import { SYMBOLS } from "../../ioc/constants.root";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../types";

import { ContainerModule } from "inversify";

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
