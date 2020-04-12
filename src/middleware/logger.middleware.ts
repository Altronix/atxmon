import { BaseMiddleware } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { UtilRoutines } from "../common/types";
import { SYMBOLS } from "../ioc/constants.root";
import * as express from "express";

@injectable()
export class LoggerMiddleware extends BaseMiddleware {
  _utils: UtilRoutines;

  constructor(@inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines) {
    super();
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
