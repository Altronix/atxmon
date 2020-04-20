import { Bcrypt } from "../common/bcrypt";
import { sign, verify } from "jsonwebtoken";
import { Logger as LoggerImpl } from "../common/logger";
import { Utils as UtilsImpl } from "../common/utils";
import { Jwt, SignFn, VerifyFn } from "../common/jwt";
import { SYMBOLS } from "./constants.root";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";
import { JwtRoutines } from "../ioc/types";

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

  bind<JwtRoutines>(SYMBOLS.JWT_ROUTINES).toDynamicValue(
    () => new Jwt(sign as SignFn, verify as VerifyFn)
  );
});

export default commonBindings;
