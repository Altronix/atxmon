import { Crypto } from "../common/crypto";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Logger as LoggerImpl } from "../common/logger";
import { Utils as UtilsImpl } from "../common/utils";
import ConfigClass from "../common/config";
import { SYMBOLS } from "./constants.root";
import {
  LoggerRoutines,
  CryptoRoutines,
  UtilRoutines,
  Config
} from "../common/types";

import { ContainerModule } from "inversify";

const commonBindings = (config?: Config) =>
  new ContainerModule(bind => {
    bind<Config>(SYMBOLS.CONFIG)
      .toDynamicValue(() => new ConfigClass(process.argv, process.env))
      .inSingletonScope();
    bind<CryptoRoutines>(SYMBOLS.CRYPTO_ROUTINES)
      .toDynamicValue(() => new Crypto(jwt, bcrypt))
      .inSingletonScope();

    bind<LoggerRoutines>(SYMBOLS.LOGGER_ROUTINES)
      .to(LoggerImpl)
      .inSingletonScope();

    bind<UtilRoutines>(SYMBOLS.UTIL_ROUTINES)
      .to(UtilsImpl)
      .inSingletonScope();
  });

export default (config?: Config) => commonBindings(config);
