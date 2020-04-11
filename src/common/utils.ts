import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CryptoRoutines, LoggerRoutines, UtilRoutines } from "./types";
import { injectable, inject } from "inversify";
import { SYMBOLS } from "../ioc/constants.root";

export type Constructor<T> = { new (): T };
export type ConstructorOrFunction<T> = Constructor<T> | Function;
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

@injectable()
export class Utils implements UtilRoutines {
  logger: LoggerRoutines;
  crypto: CryptoRoutines;
  constructor(
    @inject(SYMBOLS.LOGGER_ROUTINES) logger: LoggerRoutines,
    @inject(SYMBOLS.CRYPTO_ROUTINES) crypto: CryptoRoutines
  ) {
    this.logger = logger;
    this.crypto = crypto;
  }
}
