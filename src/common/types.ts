import { ServiceIdentifier } from "../ioc/types";
import { Request, Response, NextFunction, Router } from "express";
import { JwtRoutines } from "../ioc/types";
import * as bcrypt from "bcrypt";

export type HTTP_ALL = "all";
export type HTTP_GET = "get";
export type HTTP_POST = "post";
export type HTTP_PUT = "put";
export type HTTP_PATCH = "patch";
export type HTTP_HEAD = "head";
export type HTTP_DELETE = "delete";
export type HTTP_METHODS =
  | HTTP_ALL
  | HTTP_GET
  | HTTP_POST
  | HTTP_PUT
  | HTTP_PATCH
  | HTTP_HEAD
  | HTTP_DELETE;

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
  fatal(message: string, code: number): void;
}

export interface CryptoRoutines {
  hash(data: string, salt: string): Promise<string>;
  validate(tpass: string, hash: string): Promise<boolean>;
  salt(): Promise<string>;
  sign: (json: string | object, key: string) => Promise<string>;
  verify: <T>(json: string, key: string) => Promise<T>;
  createAccessToken: (json: any) => Promise<string>;
  createRefreshToken: (json: any) => Promise<string>;
  decodeAndValidateAccessToken: <T>(token: string) => Promise<T>;
  decodeAndValidateRefreshToken: <T>(token: string) => Promise<T>;
}

export interface DateRoutines {
  now: () => number;
}

export interface Logger {}

export interface UtilRoutines {
  crypto: CryptoRoutines;
  logger: LoggerRoutines;
}

export interface Environment {
  NODE_ENV: string;
  ATXMON_PATH: string;
  SENDGRID_API_KEY: string;
  DATABASE_NAME: string;
  DATABASE: string;
  TLS_KEY_FILE: string;
  TLS_CERT_FILE: string;
  HTTP_PORT: string;
  HTTPS_PORT: string;
  ZMTP_PORT: string;
  ZMTP_IPC: string;
  ZMTPS_PORT: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  WWW: string;
}

export interface DatabaseConfig {
  name: string;
  database: string;
  entities: string[];
  type: string;
}

export interface LinqConfig {
  zmtp: number[];
  zmtps: number;
  ipc: string[];
}

export interface HttpConfig {
  keyFile: string;
  certFile: string;
  http: number;
  https: number;
  www: string;
}

export interface MailerConfig {
  apiKey: string;
  serviceNotifications: string[];
}

export interface Config {
  database: DatabaseConfig;
  env?: Environment;
  http: HttpConfig;
  linq: LinqConfig;
  mail: MailerConfig;
  accessTokenSecret: string;
  refreshTokenSecret: string;
}

export interface MiddlewareHandler {
  handler: (req: Request, res: Response, next: NextFunction) => any;
}

// TODO this is actually a 'DatabaseController'
export interface Controller<Model, Entry = Model> {}

export interface _ControllerMetadata {
  path: string;
  middleware: ServiceIdentifier<any>[] | MiddlewareHandler[];
  target: any;
}

export interface ControllerMetadata extends _ControllerMetadata {
  middleware: ServiceIdentifier<any>[];
}

export interface MethodMetadata extends _ControllerMetadata {
  method: HTTP_METHODS;
  key: string;
  middleware: ServiceIdentifier<any>[];
}

export interface ControllerMetadataResolved extends _ControllerMetadata {
  middleware: MiddlewareHandler[];
}

export interface MethodMetadataResolved extends ControllerMetadataResolved {
  method: HTTP_METHODS;
  key: string;
}
