import { Crypto } from "../common/crypto";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import Config from "../config";
import { Logger as LoggerImpl } from "../common/logger";
import { Utils as UtilsImpl } from "../common/utils";
import { SYMBOLS } from "./constants.root";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";

import { ContainerModule } from "inversify";

const commonBindings = new ContainerModule(bind => {
  bind<CryptoRoutines>(SYMBOLS.CRYPTO_ROUTINES)
    .toDynamicValue(
      ctx => new Crypto(jwt, bcrypt, ctx.container.get<Config>(Config))
    )
    .inSingletonScope();

  bind<LoggerRoutines>(SYMBOLS.LOGGER_ROUTINES)
    .to(LoggerImpl)
    .inSingletonScope();

  bind<UtilRoutines>(SYMBOLS.UTIL_ROUTINES)
    .to(UtilsImpl)
    .inSingletonScope();
});

export default commonBindings;
