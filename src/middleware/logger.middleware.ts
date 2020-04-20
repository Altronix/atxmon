import { injectable, inject } from "inversify";
import { UtilRoutines, MiddlewareHandler } from "../common/types";
import { middleware } from "../common/decorators";
import { SYMBOLS } from "../ioc/constants.root";
import * as express from "express";

@middleware()
export class LoggerMiddleware implements MiddlewareHandler {
  constructor(@inject(SYMBOLS.UTIL_ROUTINES) private utils: UtilRoutines) {}
  public handler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    this.utils.logger.info("ROUTE HIT");
    next();
  }
}
