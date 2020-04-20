import { MiddlewareHandler } from "../types";
import { middleware } from "../common/decorators";
import { inject } from "inversify";
import { UtilRoutines } from "../common/types";
import { LinqNetworkService } from "../types";
import { Request, Response, NextFunction } from "express";
import { SYMBOLS } from "../ioc/constants.root";

@middleware()
export class DeviceExistsMiddleware implements MiddlewareHandler {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) private utils: UtilRoutines,
    @inject(SYMBOLS.LINQ_SERVICE) private linq: LinqNetworkService
  ) {}

  handler(req: Request, res: Response, next: NextFunction) {
    req.params.id;
    this.utils.logger.trace(`Device ID Middleware ${req.params.id}`);
    if (req.params.sid) {
    } else {
    }
    next();
  }
}
