import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { Database, DeviceModel } from "../database/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import * as express from "express";

export class RootController {
  utils: UtilRoutines;
  constructor(@inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines) {
    this.utils = utils;
  }

  private async root(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    next();
  }
}
