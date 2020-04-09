import * as bcrypt from "bcrypt";

export type LOG_CHANNELS =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

export interface LoggerRoutines {
  log(channel: LOG_CHANNELS, message: string): void;
  trace(message: string): void;
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
}

export interface CryptoRoutines {
  hash(data: string, salt: string): Promise<string>;
  validate(tpass: string, hash: string): Promise<boolean>;
  salt(): Promise<string>;
}

export interface Logger {}

export interface UtilRoutines {
  crypto: CryptoRoutines;
  logger: LoggerRoutines;
}
