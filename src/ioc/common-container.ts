import { Crypto } from "../common/crypto";
import { sign, verify } from "jsonwebtoken";
import { Logger as LoggerImpl } from "../common/logger";
import { Utils as UtilsImpl } from "../common/utils";
import { SYMBOLS } from "./constants.root";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";

import { ContainerModule } from "inversify";

const commonBindings = new ContainerModule(bind => {
  bind<CryptoRoutines>(SYMBOLS.CRYPTO_ROUTINES)
    .to(Crypto)
    .inSingletonScope();

  bind<LoggerRoutines>(SYMBOLS.LOGGER_ROUTINES)
    .to(LoggerImpl)
    .inSingletonScope();

  bind<UtilRoutines>(SYMBOLS.UTIL_ROUTINES)
    .to(UtilsImpl)
    .inSingletonScope();
});

export default commonBindings;
