import { injectable, inject } from "inversify";
import { UtilRoutines } from "../common/types";
import { middleware } from "../common/decorators";
import { MiddlewareHandler } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import * as express from "express";

@middleware()
export class LoggerMiddleware implements MiddlewareHandler {
  _utils: UtilRoutines;

  constructor(@inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines) {
    this._utils = utils;
  }
  public handler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    this._utils.logger.info("ROUTE HIT");
    next();
  }
}
